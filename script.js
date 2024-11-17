document.getElementById('userForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const userDetails = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phoneno: document.getElementById('phoneno').value,
        skills: document.getElementById('skills').value,
        role: document.getElementById('role').value,
        cgpa: document.getElementById('cgpa').value,
        experience: document.getElementById('experience').value,
        certifications: document.getElementById('certifications').value
    };

    const statusMessage = document.getElementById('statusMessage');
    statusMessage.innerHTML = "Submitting your details...";

    try {
        const response = await fetch('http://localhost:5000/api/save-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userDetails)
        });

        const result = await response.json();
        
        if (result.success) {
            statusMessage.innerHTML = "User details saved and email sent successfully!";
        } else {
            statusMessage.innerHTML = "There was an error. Please try again.";
        }
    } catch (error) {
        statusMessage.innerHTML = "Error: " + error.message;
    }
});
