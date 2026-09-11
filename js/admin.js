const admin = JSON.parse(
    sessionStorage.getItem("admin")
);

const token = sessionStorage.getItem(
    "adminToken"
);


if (!admin || !token) {

    window.location.href =
        "admin-login.html";

}


const sourceFilter =
    document.getElementById(
        "sourceFilter"
    );


let allBookings = [];

const params =
    new URLSearchParams(
        window.location.search
    );

const sourceFromURL =
    params.get("source");

/* LOAD BOOKINGS */

async function loadBookings() {

    try {

        const response = await fetch(

            "https://api.thekedar.store/api/bookings",

            {

                headers: {

                    "Authorization":
                        "Bearer " + token

                }

            }

        );


        if (response.status === 401) {

            sessionStorage.removeItem(
                "admin"
            );

            sessionStorage.removeItem(
                "adminToken"
            );

            window.location.href =
                "admin-login.html";

            return;

        }


        if (!response.ok) {

            alert(
                "Unable to load bookings"
            );

            return;

        }


        allBookings =
    await response.json();

updateDashboardStats();
loadSourceFilter();


if (sourceFromURL) {

    sourceFilter.value =
        sourceFromURL;


    const filteredBookings =
        allBookings.filter(
            function (booking) {

                const source =
                    booking.source_code ||
                    "DIRECT";


                return (
                    source ===
                    sourceFromURL
                );

            }
        );


    displayBookings(
        filteredBookings
    );

}

else {

    displayBookings(
        allBookings
    );

}

    }

    catch (error) {

        console.log(error);

        alert(
            "Unable to load bookings"
        );

    }

}


/* LOAD SOURCE OPTIONS */

function loadSourceFilter() {

    const sources = [];


    allBookings.forEach(
        function (booking) {

            const source =
                booking.source_code ||
                "DIRECT";


            if (!sources.includes(source)) {

                sources.push(source);

            }

        }
    );


    sources.forEach(
        function (source) {

            sourceFilter.innerHTML += `

                <option value="${source}">

                    ${source}

                </option>

            `;

        }
    );

}


/* DISPLAY BOOKINGS */

function displayBookings(bookings) {

    const table =
        document.getElementById(
            "bookingTable"
        );


    table.innerHTML = "";


    bookings.forEach(
        function (booking) {

            table.innerHTML += `

                <tr>

                    <td>

                        ${booking.id}

                    </td>

                    <td>

                        ${booking.customer_name}

                    </td>

                    <td>

                        ${booking.customer_phone}

                    </td>

                    <td>

                        ${booking.service}

                    </td>

                    <td>

                        ${booking.status}

                    </td>

                    <td>

                        ${booking.source_code || "DIRECT"}

                    </td>

                    <td>

                        <a href="booking-details.html?id=${booking.id}">

                            View

                        </a>

                    </td>

                </tr>

            `;

        }
    );

}


/* SOURCE FILTER */

sourceFilter.addEventListener(
    "change",
    function () {

        const selectedSource =
            sourceFilter.value;


        if (!selectedSource) {

            displayBookings(
                allBookings
            );

            return;

        }


        const filteredBookings =
            allBookings.filter(
                function (booking) {

                    const source =
                        booking.source_code ||
                        "DIRECT";


                    return (
                        source ===
                        selectedSource
                    );

                }
            );


        displayBookings(
            filteredBookings
        );

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
                "admin"
            );

            sessionStorage.removeItem(
                "adminToken"
            );

            window.location.href =
                "admin-login.html";

        }
    );

}

function updateDashboardStats() {

    let pending = 0;

    let confirmed = 0;

    let siteVisitDone = 0;

    let quoteSent = 0;

    let completed = 0;

    let cancelled = 0;


    allBookings.forEach(
        function (booking) {

            switch (booking.status) {

                case "PENDING":

                    pending++;

                    break;


                case "CONFIRMED":

                    confirmed++;

                    break;


                case "SITE_VISIT_DONE":

                    siteVisitDone++;

                    break;


                case "QUOTE_SENT":

                    quoteSent++;

                    break;


                case "COMPLETED":

                    completed++;

                    break;


                case "CANCELLED":

                    cancelled++;

                    break;

            }

        }
    );


    document.getElementById(
        "totalBookings"
    ).textContent =
        allBookings.length;


    document.getElementById(
        "pendingBookings"
    ).textContent =
        pending;


    document.getElementById(
        "confirmedBookings"
    ).textContent =
        confirmed;


    document.getElementById(
        "siteVisitBookings"
    ).textContent =
        siteVisitDone;


    document.getElementById(
        "quoteBookings"
    ).textContent =
        quoteSent;


    document.getElementById(
        "completedBookings"
    ).textContent =
        completed;


    document.getElementById(
        "cancelledBookings"
    ).textContent =
        cancelled;

}

/* INITIAL LOAD */

loadBookings();