var MovieVm = function () {
    var self = {};

    self.init = function (movieIo, pageSize) {
        self.movieIo = movieIo;
        self.vm = self.buildVm(pageSize);
    };

    self.buildVm = function (pageSize) {
        return new Vue({
            el: '#movie-list-wrapper',
            data: {
                page: 1,
                pageSize: pageSize,
                totalMovies: 0,
                totalPages: 0,
                pagesNumber: 0,
                modalTitle: '',
                buttonText: '',
                isMovieModalVisible: false,
                id: '',
                title: '',
                director: '',
                dateReleased: '',
                movies: [],
                errors: {}
            },
            methods: {
                openModal: self.openModal,
                closeModal: self.closeModal,
                upsertMovie: self.upsertMovie,
                dateLoseFocus: self.dateLoseFocus,
                prevPage: self.prevPage,
                nextPage: self.nextPage,
                pageEntered: self.pageEntered,
                goToFirstPage: self.goToFirstPage,
                goToLastPage: self.goToLastPage
            },
            watch: {
                title: function (newValue, oldValue) {
                    if (oldValue || newValue) {
                        self.validateField(newValue, 'title', 'Title', /^[0-9a-zA-Z\s#,\.!';:\)\(&/?-]{1,200}$/, true);
                    } else {
                        self.vm.errors.title = '';
                    }
                },
                director: function (newValue) {
                    self.validateField(newValue, 'director', 'Director', /^[0-9a-zA-Z\s#,\.!';:\)\(&/?-]{1,100}$/);
                },
                dateReleased: function (newValue) {
                    var passedDate = new Date(newValue);
                    var currentDate = new Date();

                    if (passedDate > currentDate) {
                        self.vm.errors.dateReleased = 'Release Date cannot be a future date';
                    } else {
                        self.vm.errors.dateReleased = '';
                    }
                }
            },
            mounted: function () {
                var vm = this;

                vm.$nextTick(function () {
                    vm.movies = self.getMovies();
                });
            }
        });
    };

    self.goToFirstPage = function () {
        if (self.vm.page !== 1) {
            self.vm.page = 1;
            self.vm.movies = self.getMovies();
        }
    };

    self.goToLastPage = function () {
        if (self.vm.page !== self.vm.totalPages) {
            self.vm.page = self.vm.totalPages;
            self.vm.movies = self.getMovies();
        }
    };

    self.pageEntered = function (e) {
        var page = parseInt(e.target.value);
        if (!Number.isInteger(page)) {
            alert('Invalid page number entered');
        } else if (page >= parseInt(self.vm.page) && page <= parseInt(self.vm.totalPages)) {
            self.vm.page = page;
            self.vm.movies = self.getMovies();
        } else {
            alert('Page number is not within range');
        }
    };

    self.prevPage = function () {
        var tempPage = self.vm.page - 1;
        if (tempPage >= 1) {
            self.vm.page--;
            self.vm.movies = self.getMovies();
        }
    };

    self.nextPage = function () {
        var tempPage = self.vm.page + 1;
        if (tempPage <= self.vm.totalPages) {
            self.vm.page++;
            self.vm.movies = self.getMovies();
        }
    };

    self.dateLoseFocus = function (val) {
        self.vm.dateReleased = val.target.value;        
    };

    self.openModal = function (modalTitle, buttonText, movie) {
        var vm = this;
        
        vm.modalTitle = modalTitle;
        vm.buttonText = buttonText;
        
        if (movie) {
            vm.id = movie.Id;
            vm.title = movie.Title;
            vm.director = movie.Director;
            vm.dateReleased = movie.DateReleased;
        }

        vm.isMovieModalVisible = true;
    };

    self.upsertMovie = function () {
        var errors = [];
        
        if (!self.validateFields()) {
            errors = Object.values(self.vm.errors).filter(function (v) {
                return v !== '';
            });

            alert(errors.join('\n'));
        } else {
            var data = {
                movie: {}
            };
            data.movie.id = self.vm.id;
            data.movie.title = self.vm.title;
            data.movie.director = self.vm.director;
            data.movie.dateReleased = commonJs.getFormattedDate(self.vm.dateReleased);
            data.page = self.vm.page;
            data.pageSize = self.vm.pageSize;
            
            self.movieIo.upsertMovie(data, function (response) {
                if (self.vm.totalMovies === response.Data.TotalMovies) {
                    alert('Movie successfuly edited');
                } else {
                    alert('Movie successfuly added');
                }

                response.Data.Movies.forEach(function (m) {
                    if (m.DateReleased) {
                        m.DateReleased = commonJs.getFormattedDate(m.DateReleased);
                    }
                });

                self.vm.totalPages = Math.ceil(response.Data.TotalMovies / parseInt(self.vm.pageSize));
                self.vm.totalMovies = response.Data.TotalMovies;
                self.vm.page = parseInt(response.Data.Page);
                self.vm.pageSize = parseInt(response.Data.PageSize);
                self.vm.movies = response.Data.Movies;
                
                self.closeModal();
            });
        }
    };

    self.addMovie = function () {
        self.modalTitle = 'Edit Movie';
        self.isMovieModalVisible = true;
    };

    self.getMovies = function () {
        var data = {};
        data.page = self.vm.page;
        data.pageSize = parseInt(self.vm.pageSize);

        return self.movieIo.getMovies(data, function (response) {
            self.vm.movies = response.Data.Movies;
            self.vm.totalPages = Math.ceil(response.Data.TotalMovies / parseInt(self.vm.pageSize));
            self.vm.totalMovies = response.Data.TotalMovies;
            self.vm.page = parseInt(response.Data.Page);
            self.vm.pageSize = parseInt(response.Data.PageSize);

            self.vm.movies.forEach(function (m) {
                if (m.DateReleased) {
                    m.DateReleased = commonJs.getFormattedDate(m.DateReleased);
                }
            });
        });
    };

    self.closeModal = function () {
        self.clearMovieFields();
        self.vm.isMovieModalVisible = false;
    };

    self.clearMovieFields = function () {
        self.vm.id = '';
        self.vm.title = '';
        self.vm.director = '';
        self.vm.dateReleased = '';
        self.vm.errors = {};
    };

    self.validateFields = function () {
        self.validateField(self.vm.title, 'title', 'Title', /^[0-9a-zA-Z\s#,\.!';:\)\(&/?-]{1,200}$/, true);

        var errors = Object.keys(self.vm.errors).filter(function (k) {
            return self.vm.errors[k] !== '';
        });

        return errors.length === 0;
    };

    self.validateField = function (newValue, fieldname, inputField, regExp, isRequired) {
        if (!newValue) {
            if (isRequired) {
                self.vm.errors[fieldname] = inputField + ' is required';
            } else {
                self.vm.errors[fieldname] = '';
            }
        } else {
            if (regExp) {
                var regex = new RegExp(regExp, 'i');
                if (!regex.test(newValue)) {
                    self.vm.errors[fieldname] = 'Invalid ' + inputField;
                } else {
                    self.vm.errors[fieldname] = '';
                }
            } else {
                self.vm.errors[fieldname] = '';
            }
        }
    };

    return {
        init: self.init
    };
};

var MovieIo = function () {
    var self = {};

    self.ioCompleted = function (response, callBack) {
        if (!response.Success) {
            alert(response.Message);
        } else {
            callBack(response);
        }
    };

    self.getMovies = function (data, callBack) {
        $.ajax({
            url: '/movie/getall',
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            dataType: 'json',
            success: function (response) {
                self.ioCompleted(response, callBack);
            }
        });
    };

    self.upsertMovie = function (data, callBack) {
        $.ajax({
            url: '/movie/upsert',
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            dataType: 'json',
            success: function (response) {
                callBack(response);
            }
        });
    };

    return self;
};

$(document).ready(function () {
    var movieVm = new MovieVm();
    var movieIo = new MovieIo();

    var pageSize = $('#PageSize').val();

    movieVm.init(movieIo, pageSize);
});

$(function () {
    $('#datetimepicker').datetimepicker();
});