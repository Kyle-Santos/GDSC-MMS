$(document).ready(function() {
    $('#add-user').hide();
    $('#add-event').hide();

    //adding events
    $('#add-event-btn').on('click', function() {
        $('#add-event').show();
    });

    $('.edit-btn').on('click', function() {
        // Hide the edit button
        $(this).hide();

        // Replace spans with input fields
        $('.event-details .info-item .value').each(function() {
            var $this = $(this);
            var input = $('<input>', {
                type: 'text',
                value: $this.text(),
                placeholder: $this.text(),
                id: $this.attr('id')
            }).css({
                'color': 'black'
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

            // Gather form data
            const formData = {};
            $('.event-details .info-item input').each(function() {
                var $this = $(this);
                if ($this.val() == "") {
                    formData[$this.attr('id')] = $this.attr('placeholder');    
                }
                else {
                    formData[$this.attr('id')] = $this.val();
                }
            });
            
            
            // AJAX request to updateEvent endpoint
            $.ajax({
                type: 'POST',
                url: '/update-event', 
                contentType: 'application/json',
                data: JSON.stringify({
                    editedEventData: formData,
                    eventID: parseInt($('.event-body').attr('id'), 10)
                }),
                success: function(response) {
                    console.log('User updated successfully:', response);
                    
                    // Replace inputs with spans
                    $('.event-details .info-item input').each(function() {
                        var $this = $(this);
                        if ($this.val() == "") 
                            text = $this.attr('placeholder');
                        else
                            text = $this.val();

                        var input = $('<span>', {
                            class: 'value',
                            id: $this.attr('id'),
                            text: text,
                        });
                        $this.replaceWith(input);
                    });
            
                    $('.save-changes').remove();
                    $('.discard-changes').remove();
                    $('.edit-btn').show();
                },
                error: function(error) {
                    console.error('Error updating user:', error);
                    resetEdit();
                }
            });
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
        $('#add-event').hide();
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
