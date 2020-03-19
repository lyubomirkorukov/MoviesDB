var commonJs = {
    getFormattedDate: function (date) {
        var parsed = moment(date);
        return parsed.isValid() ? parsed.format('D/M/YYYY') : date;
    }
};