const admin = JSON.parse(
    sessionStorage.getItem("admin")
);

const token = sessionStorage.getItem(
    "adminToken"
);


if (!admin || !token) {

    window.location.href = "admin-login.html";

}


const params = new URLSearchParams(
    window.location.search
);

const bookingId = params.get("id");


if (!bookingId) {

    alert("Invalid Booking ID");

    window.location.href = "admin.html";

}


async function loadBooking() {

    try {

        const response = await fetch(

            `http://localhost:3000/api/booking/${bookingId}`,

            {

                headers: {

                    "Authorization":
                        "Bearer " + token

                }

            }

        );


        if (response.status === 401) {

            sessionStorage.removeItem("admin");

            sessionStorage.removeItem("adminToken");

            window.location.href =
                "admin-login.html";

            return;

        }


        if (!response.ok) {

            alert("Unable to load booking");

            return;

        }


        const booking =
            await response.json();


        document.getElementById("name").textContent =
            booking.customer_name;

        document.getElementById("phone").textContent =
            booking.customer_phone;

        document.getElementById("address").textContent =
            booking.address;

        document.getElementById("service").textContent =
            booking.service;

        document.getElementById("date").textContent =
            booking.booking_date;

        document.getElementById("time").textContent =
            booking.booking_time;

        document.getElementById("notes").textContent =
            booking.notes || "No notes";

        document.getElementById("status").value =
            booking.status;

    }

    catch (error) {

        console.log(error);

        alert("Server Error");

    }

}


async function saveStatus() {

    const status =
        document.getElementById("status").value;


    try {

        const response = await fetch(

            `http://localhost:3000/api/booking/${bookingId}/status`,

            {

                method: "PATCH",

                headers: {

                    "Content-Type":
                        "application/json",

                    "Authorization":
                        "Bearer " + token

                },

                body: JSON.stringify({

                    status: status

                })

            }

        );


        if (response.status === 401) {

            sessionStorage.removeItem("admin");

            sessionStorage.removeItem("adminToken");

            window.location.href =
                "admin-login.html";

            return;

        }


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Unable to update status"
            );

            return;

        }


        alert(data.message);

    }

    catch (error) {

        console.log(error);

        alert("Server Error");

    }

}


document
    .getElementById("saveButton")
    .addEventListener(
        "click",
        saveStatus
    );


loadBooking();