const getMonthYear = () => {
    let datenow;

    function formatDate(date) {
        var year = date.getFullYear().toString();
        var month = parseInt((date.getMonth() + 101).toString().substring(1));
        var day = (date.getDate() + 100).toString().substring(1);
        const monthName = {
            1: 'January',
            2: 'Febuary',
            3: 'March',
            4: 'April',
            5: 'May',
            6: 'June',
            7: 'July',
            8: 'August',
            9: 'September',
            10: 'October',
            11: 'November',
            12: 'December'
        }
        return monthName[month] + ", " + year;
    }

    const dateNow = formatDate(new Date())

    return dateNow
}

export const getMonthYearNumbered = () => {
    const date = new Date()
        let month = (date.getMonth() + 1).toString()
        let year = date.getFullYear().toString();
        
        if (month.length <= 1) {
            month = '0' + month
        }
    const curMonth = month + year

    return curMonth
}

export default getMonthYear;
