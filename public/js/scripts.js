window.onload = function () {
        document.getElementById('apodForm').onsubmit = function() {
        var formHandle = document.forms.apodForm;

        var date = formHandle.archiveDate.value;

        return false;
    }
}
