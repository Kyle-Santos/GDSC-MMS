$(document).ready(function() {
    $('#add-user').hide();

    $('.edit-btn').on('click', function() {
        // Hide the edit button
        $(this).hide();

        // Replace spans with input fields
        $('.event-details .info-item .value').each(function() {
            var $this = $(this);
            var input = $('<input>', {
                type: 'text',
                value: $this.text(),
                id: $this.attr('id')
            });
            $this.replaceWith(input);
        });


        var saveBtn = $('<a>', {
            text: 'Save Changes',
            class: 'save-changes',
            href: '#'
        });

        var discardBtn = $('<a>', {
            text: 'Discard Changes',
            class: 'discard-changes',
            href: '#'
        });

        $('.event-tracker .footer').append(saveBtn).append(discardBtn);

        // Add event listeners for Save Changes and Discard Changes buttons
        $('.save-changes').on('click', function(event) {
            event.preventDefault();
            $('.profile-details .info-item input').each(function() {
                var $this = $(this);
                var span = $('<span>', {
                    class: 'value',
                    text: $this.val()
                });
                $this.replaceWith(span);
            });
            resetEdit();
        });

        $('.discard-changes').on('click', function(event) {
            event.preventDefault();
            resetEdit();
        });
    });

    $('#add-user-btn').on('click', function() {
        $('#add-user').show();
    });

    $('.cancel').on('click', function() {
        $('#add-user').hide();
    });
    


    function resetEdit() {
        // Replace spans with input fields
        $('.event-details .info-item input').each(function() {
            var $this = $(this);
            var input = $('<span>', {
                class: 'value',
                id: $this.attr('id'),
                text: $this.val(),
            });
            $this.replaceWith(input);
        });

        $('.save-changes').remove();
        $('.discard-changes').remove();
        $('.edit-btn').show();
    }
});
