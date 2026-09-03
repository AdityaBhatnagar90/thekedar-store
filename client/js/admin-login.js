const form = document.getElementById("adminLoginForm");

form.addEventListener("submit", async function (e) {

    e.preventDefault();

    const admin = {

        email: document.getElementById("email").value.trim(),

        password: document.getElementById("password").value

    };

    try {

        const response = await fetch(

            "http://localhost:3000/api/admin/login",

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify(admin)

            }

        );

        const data = await response.json();

        if (response.status === 200) {

            sessionStorage.setItem(
                "adminToken",
                data.token
            );

            sessionStorage.setItem(
                "admin",
                JSON.stringify(data.admin)
            );

            window.location.href = "admin.html";

            return;

        }

        alert(
            data.message ||
            "Invalid admin credentials"
        );

    }

    catch (error) {

        console.log(error);

        alert("Server Error");

    }

});