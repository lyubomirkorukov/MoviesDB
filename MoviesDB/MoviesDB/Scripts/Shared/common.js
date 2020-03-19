var commonJs = {
    getFormattedDate: function (date) {
        var parsed = moment(date);
        return parsed.isValid() ? parsed.format('M/D/YYYY') : date;
    }
};