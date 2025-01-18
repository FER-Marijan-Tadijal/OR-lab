$('form').submit(false);

$('#tablica').DataTable( {
    ajax: 'http://localhost:8080/oldData',
    layout: {
        topStart: {
            buttons: [
                'copy', 'csv', 'json',
                {
                    text: 'JSON',
                    action: function (e, dt, button, config) {
                        var data = dt.buttons.exportData();
 
                        DataTable.fileSave(new Blob([JSON.stringify(data)]), 'Export.json');
                    }
                }
            ]
        }
    },
    initComplete: function () {
        this.api()
            .columns()
            .every(function () {
                let column = this;
                let title = column.footer().textContent;
 
                // Create input element
                let input = document.createElement('input');
                input.placeholder = title;
                column.footer().replaceChildren(input);
 
                // Event listener for user input
                input.addEventListener('keyup', () => {
                    if (column.search() !== this.value) {
                        column.search(input.value).draw();
                    }
                });
            });
    },
} );