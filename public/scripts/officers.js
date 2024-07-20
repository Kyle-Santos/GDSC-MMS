$(document).ready(function() {
    $('.edit-btn').on('click', function() {
        // Hide the edit button
        $(this).hide();

        // Replace spans with input fields
        $('.profile-details .info-item .value').each(function() {
            var $this = $(this);
            var input = $('<input>', {
                type: 'text',
                value: $this.text(),
                id: $this.attr('id')
            });
            $this.replaceWith(input);
        });

        // Replace dispute link with Save Changes and Discard Changes buttons
        var $disputeLink = $('#makeReport');
        $disputeLink.hide();

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

        $('.footer').append(saveBtn).append(discardBtn);

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

    function resetEdit() {
        // Replace spans with input fields
        $('.profile-details .info-item input').each(function() {
            var $this = $(this);
            var input = $('<span>', {
                class: 'value',
                id: $this.attr('id'),
                text: $this.attr('value'),
            });
            $this.replaceWith(input);
        });

        $('.save-changes').remove();
        $('.discard-changes').remove();
        $('#makeReport').show();
        $('.edit-btn').show();
    }
});
