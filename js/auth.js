const email =
    document.getElementById("email");

const phone =
    document.getElementById("phone");

const password =
    document.getElementById("password");

const signupButton =
    document.getElementById("signupButton");

const loginButton =
    document.getElementById("loginButton");


signupButton.addEventListener(
    "click",
    signup
);

loginButton.addEventListener(
    "click",
    login
);


async function signup() {

    const user = {

        email: email.value.trim(),

        phone: phone.value.trim(),

        password: password.value

    };


    if (!email.value.trim()) {

        alert("Email is required");

        return;

    }


    /* EMAIL FORMAT */

    if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            email.value.trim()
        )
    ) {

        alert("Enter a valid email address");

        return;

    }


    if (!phone.value.trim()) {

        alert("Phone number is required");

        return;

    }


    /* PHONE FORMAT */

    if (
        !/^[6-9]\d{9}$/.test(
            phone.value.trim()
        )
    ) {

        alert(
            "Enter a valid 10-digit Indian mobile number"
        );

        return;

    }


    if (!password.value) {

        alert("Password is required");

        return;

    }


    /* PASSWORD LENGTH */

    if (password.value.length < 8) {

        alert(
            "Password must be at least 8 characters"
        );

        return;

    }


    try {

        const response = await fetch(

            "https://api.thekedar.store/api/signup",

            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body: JSON.stringify(user)

            }

        );


        const data =
            await response.json();


        if (response.status === 409) {

            alert(data.message);

            return;

        }


        if (!response.ok) {

            alert(
                data.message ||
                "Signup failed"
            );

            return;

        }


        if (response.status === 201) {

            alert("Signup Successful");

            email.value = "";

            phone.value = "";

            password.value = "";

        }

    }

    catch (error) {

        console.log(error);

        alert("Server Error");

    }

}


async function login() {

    const user = {

        email: email.value.trim(),

        password: password.value

    };


    if (!email.value.trim()) {

        alert("Email is required");

        return;

    }


    if (!password.value) {

        alert("Password is required");

        return;

    }


    try {

        const response = await fetch(

            "https://api.thekedar.store/api/login",

            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body: JSON.stringify(user)

            }

        );


        const data =
            await response.json();


        if (response.status === 401) {

            alert(data.message);

            return;

        }


        if (!response.ok) {

            alert(
                data.message ||
                "Login failed"
            );

            return;

        }


        if (response.status === 200) {

            sessionStorage.setItem(
                "userToken",
                data.token
            );

            sessionStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            window.location.href =
                "booking.html";

        }

    }

    catch (error) {

        console.log(error);

        alert("Server Error");

    }

}