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

    $('#search').on('click', function() {
        var name = $('#namesearch').val().toLowerCase().trim();
        var eventid = $('.event-body').attr('id');
        var id = $('#id-num').val();
        var position = $('#mem-position').val();

        // Make an AJAX request to get event attendance
        $.ajax({
            url: '/event/' + eventid + "/attendance",
            method: 'GET',
            success: function(attendanceList) {
                if (name == "" && id === 0 && position === "position") {
                    populate(attendanceList);
                }
                else  {
                    filterAttendanceList(attendanceList, name, id, position);
                }
            },
            error: function(error) {
                console.error('Error fetching attendance:', error);
            }
        });
    });
    
    function filterAttendanceList(attendanceList, name, id, position) {
        var attendees = attendanceList.filter(attendee => {
            var fullname = (attendee.firstname + " " + attendee.lastname).toLowerCase().trim();
            return fullname === name || fullname.includes(name);
        });

        if (id && id !== '0') {
            attendees = attendees.filter(member => member.studentId.toString().includes(id));
        }

        if (position && position !== 'position') {
            attendees = attendees.filter(member => member.position === position);
        }

        populate(attendees);
    }

    function populate(attendees) {
        const attendanceListElement = $('#attendance-list');
        attendanceListElement.empty();

        attendees.forEach(member => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${member.lastname}, ${member.firstname}</td>
                <td>${member.email}</td>
                <td>${member.position}</td>
            `;
            attendanceListElement.append(row);
        });
    }

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
