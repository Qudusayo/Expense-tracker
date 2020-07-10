new Vue({
    el: "#app",
    data: {
        amount: '',
        to: '',
        info: '',
        date: '',
        total: 0,
        error: false,
        expenses: []
    },
    methods: {
        addExpense: function () {
            if (this.checkForm()) {
                this.error = true;
            } else {
                const data = {
                    amount: this.amount,
                    to: this.to,
                    info: this.info,
                    date: this.date
                };
                this.amount = '';
                this.to = '';
                this.info = '';
                this.date = '';
                this.expenses.unshift(data);
                localStorage.setItem('q-vue-expenses', JSON.stringify(this.expenses));
                this.getTotal()
            }
        },
        clearExpenses: function () {
            this.expenses = [];
            this.total = 0;
            localStorage.setItem('q-vue-expenses', JSON.stringify(this.expenses));

        },
        getTotal: function () {
            let initialTotal = 0;
            this.expenses.forEach(data => {
                initialTotal += Math.abs(data.amount)
            });
            this.total = initialTotal;
        },
        checkForm: function () {
            return this.amount === '' || this.to === '' || this.info === '' || this.data === '' ? true : false
        },
        getCsv: function () {
            const headers = {
                amount: "Amount",
                to: "For",
                info: "Info",
                date: "Date"
            };

            let itemsNotFormatted = JSON.parse(localStorage.getItem('q-vue-expenses'));

            let itemsFormatted = [];

            // format the data
            itemsNotFormatted.forEach((item) => {
                itemsFormatted.push({
                    amount: item.amount, // remove commas to avoid errors,
                    to: item.to,
                    info: item.info,
                    date: item.date
                });
            });

            const fileTitle = 'Expenses'; // or 'my-unique-title'

            this.exportCSVFile(headers, itemsFormatted, fileTitle);
        },
        convertToCSV: function (objArray) {
            var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
            var str = '';

            for (var i = 0; i < array.length; i++) {
                var line = '';
                for (var index in array[i]) {
                    if (line != '') line += ','

                    line += array[i][index];
                }

                str += line + '\r\n';
            }

            return str;
        },
        exportCSVFile: function (headers, items, fileTitle) {
            if (headers) {
                items.unshift(headers);
            }

            // Convert Object to JSON
            var jsonObject = JSON.stringify(items);

            var csv = this.convertToCSV(jsonObject);

            var exportedFilenmae = fileTitle + '.csv' || 'export.csv';

            var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            if (navigator.msSaveBlob) { // IE 10+
                navigator.msSaveBlob(blob, exportedFilenmae);
            } else {
                var link = document.createElement("a");
                if (link.download !== undefined) { // feature detection
                    // Browsers that support HTML5 download attribute
                    var url = URL.createObjectURL(blob);
                    link.setAttribute("href", url);
                    link.setAttribute("download", exportedFilenmae);
                    link.style.visibility = 'hidden';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            }
        }
    },
    created: function () {
        if (localStorage.getItem('q-vue-expenses')) {
            this.expenses = JSON.parse(localStorage.getItem('q-vue-expenses'));
        } else {
            localStorage.setItem('q-vue-expenses', JSON.stringify([]));
        }
        this.getTotal()
    }
})