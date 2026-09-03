const user = JSON.parse(
    sessionStorage.getItem("user")
);

const token =
    sessionStorage.getItem("userToken");


/* AUTH CHECK */

if (!user || !token) {

    alert("Please login first.");

    window.location.href =
        "index.html";

}


/* DATE RESTRICTION */

const dateInput =
    document.getElementById("date");

if (dateInput) {

    const today =
        new Date().toISOString().split("T")[0];

    dateInput.min = today;

}


/* FORM */

const form =
    document.getElementById("bookingForm");


const submitButton =
    document.getElementById(
        "submitBookingButton"
    );


/* BOOKING SUBMIT */

form.addEventListener(
    "submit",
    async function (e) {

        e.preventDefault();


        /*
         * Prevent multiple submissions.
         *
         * If the button has already been
         * clicked, do nothing.
         */

        if (submitButton.disabled) {

            return;

        }


        /*
         * Disable immediately.
         */

        submitButton.disabled = true;

        submitButton.textContent =
            "Booking...";


        /* COLLECT FORM DATA */

        const booking = {

            customer_name:
                document.getElementById(
                    "name"
                ).value.trim(),

            customer_phone:
                document.getElementById(
                    "phone"
                ).value.trim(),

            address:
                document.getElementById(
                    "address"
                ).value.trim(),

            service:
                document.getElementById(
                    "service"
                ).value,

            booking_date:
                document.getElementById(
                    "date"
                ).value,

            booking_time:
                document.getElementById(
                    "time"
                ).value,

            notes:
                document.getElementById(
                    "notes"
                ).value.trim(),

            source_code:
                localStorage.getItem(
                    "sourceCode"
                ) || "DIRECT"

        };


        try {

            const response =
                await fetch(

                    "http://localhost:3000/api/booking",

                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "Authorization":
                                "Bearer " + token

                        },

                        body:
                            JSON.stringify(
                                booking
                            )

                    }

                );


            const data =
                await response.json();


            /*
             * SESSION EXPIRED
             */

            if (response.status === 401) {

                sessionStorage.removeItem(
                    "user"
                );

                sessionStorage.removeItem(
                    "userToken"
                );

                alert(
                    "Your session has expired. Please login again."
                );

                window.location.href =
                    "index.html";

                return;

            }


            /*
             * BOOKING SUCCESS
             */

            if (response.status === 201) {

                alert(
                    "Booking Created Successfully"
                );

                window.location.href =
                    "success.html";

                return;

            }


            /*
             * OTHER API ERROR
             *
             * Re-enable button so the user
             * can correct the form and retry.
             */

            submitButton.disabled = false;

            submitButton.textContent =
                "Book Inspection";


            alert(

                data.message ||
                "Unable to create booking"

            );

        }


        catch (error) {

            console.log(error);


            /*
             * Re-enable button if there
             * was a network/server error.
             */

            submitButton.disabled = false;

            submitButton.textContent =
                "Book Inspection";


            alert(
                "Server Error"
            );

        }

    }
);


/* LOGOUT */

const logoutButton =
    document.getElementById(
        "logoutButton"
    );


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function () {

            sessionStorage.removeItem(
                "user"
            );

            sessionStorage.removeItem(
                "userToken"
            );

            window.location.href =
                "index.html";

        }
    );

}