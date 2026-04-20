document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.getElementById('registrationForm');
    const scriptURL = 'https://script.google.com/macros/s/AKfycbzd8KqumNTmMBVRjnTGd8DMVfje9NmY1EeeqoxZ8glgCTNfJz_E0D6rgZ5zdMKL21RjeQ/exec'; // <--- Paste your App Script URL here

    registrationForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Validate at least one schedule checkbox is selected
        const allScheduleCheckboxes = document.querySelectorAll('.schedule-dropdown input[type="checkbox"]:checked');
        const scheduleError = document.getElementById('scheduleError');
        if (allScheduleCheckboxes.length === 0) {
            scheduleError.style.display = 'block';
            scheduleError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }
        scheduleError.style.display = 'none';

        const submitBtn = document.querySelector('.btn-submit-modern');
        const originalText = submitBtn.innerText;
        submitBtn.innerText = "Processing...";
        submitBtn.disabled = true;

        const formData = new FormData(registrationForm);
        formData.append('location', 'Dammam');

        // Send country_code + mobile together without "+"
        const countryCode = document.getElementById('country_code_input').value;
        const mobileNum = formData.get('mobile');
        formData.set('mobile', countryCode + mobileNum);

        // Collect schedule checkbox values
        const tue5Checked = document.querySelectorAll('input[name="tuesday5_schedule"]:checked');
        formData.set('tuesday5_schedule', Array.from(tue5Checked).map(cb => cb.value).join(', '));

        const sat9Checked = document.querySelectorAll('input[name="saturday9_schedule"]:checked');
        formData.set('saturday9_schedule', Array.from(sat9Checked).map(cb => cb.value).join(', '));

        fetch(scriptURL, { 
            method: 'POST', 
            body: formData 
        })
        .then(response => {
            alert('Registration Successful!');
            registrationForm.reset();
            // Reset schedule dropdown placeholders
            document.querySelectorAll('.schedule-dropdown .placeholder-text').forEach(el => {
                el.textContent = 'Select your schedule';
            });
        })
        .catch(error => {
            console.error('Error!', error.message);
            alert('Submission failed. Please try again.');
        })
        .finally(() => {
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
        });
    });

    // Close schedule dropdowns and country dropdown when clicking outside
    document.addEventListener('click', function(e) {
        document.querySelectorAll('.schedule-dropdown').forEach(function(dropdown) {
            if (!dropdown.contains(e.target)) {
                dropdown.querySelector('.checkboxes-container').style.display = 'none';
                dropdown.querySelector('.arrow').classList.remove('open');
            }
        });

        // Close country code dropdown
        var countryDropdown = document.getElementById('countryCodeDropdown');
        if (countryDropdown && !countryDropdown.contains(e.target)) {
            document.getElementById('countryOptions').style.display = 'none';
        }
    });

    // Country code option selection
    document.querySelectorAll('.country-option').forEach(function(option) {
        option.addEventListener('click', function() {
            var code = this.getAttribute('data-code');
            var flag = this.getAttribute('data-flag');
            var label = this.getAttribute('data-label');
            document.getElementById('selectedFlag').src = flag;
            document.getElementById('selectedFlag').alt = label + ' Flag';
            document.getElementById('selectedCode').textContent = '+' + code;
            document.getElementById('country_code_input').value = code;
            document.getElementById('countryOptions').style.display = 'none';
        });
    });

    // Update placeholder text when checkboxes change
    document.querySelectorAll('.schedule-dropdown input[type="checkbox"]').forEach(function(cb) {
        cb.addEventListener('change', function() {
            // Hide schedule error if any checkbox is now checked
            var anyChecked = document.querySelectorAll('.schedule-dropdown input[type="checkbox"]:checked').length > 0;
            if (anyChecked) {
                document.getElementById('scheduleError').style.display = 'none';
            }

            const dropdown = this.closest('.schedule-dropdown');
            const checked = dropdown.querySelectorAll('input[type="checkbox"]:checked');
            const placeholder = dropdown.querySelector('.placeholder-text');
            if (checked.length > 0) {
                const names = Array.from(checked).map(c => c.value.split('— ')[1] || c.value);
                placeholder.textContent = names.join(', ');
            } else {
                placeholder.textContent = 'Select your schedule';
            }
        });
    });
});

function toggleCountryDropdown() {
    event.stopPropagation();
    var options = document.getElementById('countryOptions');
    options.style.display = options.style.display === 'block' ? 'none' : 'block';
}

function toggleScheduleDropdown(id) {
    event.stopPropagation();
    var dropdown = document.getElementById(id);
    var container = dropdown.querySelector('.checkboxes-container');
    var arrow = dropdown.querySelector('.arrow');
    var isOpen = container.style.display === 'block';

    // Close all other dropdowns
    document.querySelectorAll('.schedule-dropdown').forEach(function(d) {
        if (d.id !== id) {
            d.querySelector('.checkboxes-container').style.display = 'none';
            d.querySelector('.arrow').classList.remove('open');
        }
    });

    container.style.display = isOpen ? 'none' : 'block';
    arrow.classList.toggle('open', !isOpen);
}
