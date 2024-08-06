$(document).ready(function() {
    // Store the elements to be removed
    var hiddenElement = $('.password').detach();

    $('#position').change(function() {
        if ($(this).val() === 'Member') {
            hiddenElement = $('.password').detach();
        } else {
            $(hiddenElement).appendTo('#add-user-details');
        }
    });

    $('#add-user').hide();


    $('.edit-btn').on('click', function() {
        // Hide the edit button
        $(this).hide();

        // Replace spans with input fields
        var $contact = $('.profile-details .info-item #contactnum');
        var input = $('<input>', {
            type: 'text',
            placeholder: $contact.text(),
            id: $contact.attr('id')
        }).css({
            'color': 'black'
        });
        $contact.replaceWith(input);

        var $email = $('.profile-details .info-item #email');
        var input = $('<input>', {
            type: 'text',
            placeholder: $email.text(),
            id: $email.attr('id')
        }).css({
            'color': 'black'
        });
        $email.replaceWith(input);

        // Replace dispute link with Save Changes and Discard Changes buttons
        var $disputeLink = $('.blacklist');
        $disputeLink.hide();

        var saveBtn = $('<a>', {
            text: 'Save Changes',
            class: 'save-changes',
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

            if ($('#email').val() == "" && $('#contactnum').val() == "") {
                resetEdit();
                return;
            }

            // Gather form data
            const formData = {};
            $('.profile-details .info-item input').each(function() {
                var $this = $(this);
                if ($this.val() == "") {
                    formData[$this.attr('id')] = $this.attr('placeholder');    
                }
                else {
                    formData[$this.attr('id')] = $this.val();
                }
            });

            // AJAX request to updateUser endpoint
            $.ajax({
                type: 'POST',
                url: '/update-user', 
                contentType: 'application/json',
                data: JSON.stringify({
                    editedUserData: formData,
                    id: parseInt($('#idnumber').text(), 10)
                }),
                success: function(response) {
                    console.log('User updated successfully:', response);
                    
                    // Replace inputs with spans
                    $('#contactnum').attr('placeholder', formData['contactnum']);
                    $('#email').attr('placeholder', formData['email']);
                    resetEdit();
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
    });
    


    function resetEdit() {
        // Replace spans with input fields
        $('.profile-details .info-item input').each(function() {
            var $this = $(this);
            var input = $('<span>', {
                class: 'value',
                id: $this.attr('id'),
                text: $this.attr('placeholder'),
            });
            $this.replaceWith(input);
        });

        $('.save-changes').remove();
        $('.discard-changes').remove();
        $('.blacklist').show();
        $('.edit-btn').show();
    }
});
