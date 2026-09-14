const admin =
    JSON.parse(
        sessionStorage.getItem(
            "admin"
        )
    );

const token =
    sessionStorage.getItem(
        "adminToken"
    );


/* AUTH CHECK */

if (!admin || !token) {

    window.location.href =
        "admin-login.html";

}


/* GET SUPPLIER CODE FROM URL */

const params =
    new URLSearchParams(
        window.location.search
    );

const supplierCode =
    params.get("code");


if (!supplierCode) {

    alert(
        "Supplier code missing"
    );

    window.location.href =
        "suppliers.html";

}


/* API BASE URL */

const API_BASE_URL =
    "https://api.thekedar.store";


/* LOAD SUPPLIER */

async function loadSupplier() {

    try {

        const response =
            await fetch(

                API_BASE_URL +
                "/api/suppliers/" +
                encodeURIComponent(
                    supplierCode
                ),

                {

                    headers: {

                        "Authorization":
                            "Bearer " +
                            token

                    }

                }

            );


        /* ADMIN SESSION EXPIRED */

        if (
            response.status ===
            401
        ) {

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
                "Unable to load supplier"
            );

            return;

        }


        const supplier =
            await response.json();


        /* SUPPLIER CODE */

        document.getElementById(
            "supplierCode"
        ).value =
            supplier.supplier_code;


        /* SUPPLIER BOOKING LINK */

        const bookingLink =
            "https://www.thekedar.store/?source=" +
            encodeURIComponent(
                supplier.supplier_code
            );


        document.getElementById(
            "supplierBookingLink"
        ).value =
            bookingLink;


        /* SUPPLIER NAME */

        document.getElementById(
            "supplierName"
        ).value =
            supplier.supplier_name ||
            "";


        /* PHONE */

        document.getElementById(
            "phone"
        ).value =
            supplier.phone ||
            "";


        /* AREA */

        document.getElementById(
            "area"
        ).value =
            supplier.area ||
            "";


        /* ADDRESS */

        document.getElementById(
            "address"
        ).value =
            supplier.address ||
            "";


        /* STATUS */

        document.getElementById(
            "status"
        ).value =
            supplier.status ||
            "ACTIVE";

    }

    catch (error) {

        console.log(
            error
        );

        alert(
            "Unable to load supplier"
        );

    }

}


/* UPDATE SUPPLIER */

const form =
    document.getElementById(
        "supplierForm"
    );


form.addEventListener(
    "submit",
    async function (e) {

        e.preventDefault();


        const supplier = {

            supplier_name:
                document.getElementById(
                    "supplierName"
                ).value.trim(),

            phone:
                document.getElementById(
                    "phone"
                ).value.trim(),

            area:
                document.getElementById(
                    "area"
                ).value.trim(),

            address:
                document.getElementById(
                    "address"
                ).value.trim(),

            status:
                document.getElementById(
                    "status"
                ).value

        };


        try {

            const response =
                await fetch(

                    API_BASE_URL +
                    "/api/suppliers/" +
                    encodeURIComponent(
                        supplierCode
                    ),

                    {

                        method:
                            "PATCH",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "Authorization":
                                "Bearer " +
                                token

                        },

                        body:
                            JSON.stringify(
                                supplier
                            )

                    }

                );


            const data =
                await response.json();


            /* ADMIN SESSION EXPIRED */

            if (
                response.status ===
                401
            ) {

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


            /* SUCCESS */

            if (response.ok) {

                alert(
                    "Supplier Updated Successfully"
                );

                loadSupplier();

                return;

            }


            /* ERROR */

            alert(

                data.message ||
                "Unable to update supplier"

            );

        }

        catch (error) {

            console.log(
                error
            );

            alert(
                "Server Error"
            );

        }

    }
);


/* BACK */

document.getElementById(
    "backButton"
).addEventListener(
    "click",
    function () {

        window.location.href =
            "suppliers.html";

    }
);


/* VIEW SUPPLIER BOOKINGS */

const viewBookingsButton =
    document.getElementById(
        "viewBookingsButton"
    );


if (viewBookingsButton) {

    viewBookingsButton.addEventListener(
        "click",
        function () {

            window.location.href =
                "admin.html?source=" +
                encodeURIComponent(
                    supplierCode
                );

        }
    );

}


/* LOGOUT */

document.getElementById(
    "logoutButton"
).addEventListener(
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


/* LOAD SUPPLIER BOOKINGS */

async function loadSupplierBookings() {

    try {

        const response =
            await fetch(

                API_BASE_URL +
                "/api/bookings",

                {

                    headers: {

                        "Authorization":
                            "Bearer " +
                            token

                    }

                }

            );


        /* ADMIN SESSION EXPIRED */

        if (
            response.status ===
            401
        ) {

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

            return;

        }


        const bookings =
            await response.json();


        /* FILTER BOOKINGS
           BELONGING TO THIS SUPPLIER */

        const supplierBookings =
            bookings.filter(
                function (booking) {

                    return (
                        booking.source_code ===
                        supplierCode
                    );

                }
            );


        document.getElementById(
            "bookingCount"
        ).textContent =
            supplierBookings.length;

    }

    catch (error) {

        console.log(
            error
        );

    }

}


/* COPY BOOKING LINK */

const copyBookingLinkButton =
    document.getElementById(
        "copyBookingLinkButton"
    );


if (copyBookingLinkButton) {

    copyBookingLinkButton.addEventListener(
        "click",
        async function () {

            const bookingLink =
                document.getElementById(
                    "supplierBookingLink"
                ).value;


            try {

                await navigator.clipboard.writeText(
                    bookingLink
                );


                alert(
                    "Supplier booking link copied"
                );

            }

            catch (error) {

                console.log(
                    error
                );

                alert(
                    "Unable to copy booking link"
                );

            }

        }
    );

}


/* SHARE ON WHATSAPP */

const shareWhatsAppButton =
    document.getElementById(
        "shareWhatsAppButton"
    );


if (shareWhatsAppButton) {

    shareWhatsAppButton.addEventListener(
        "click",
        function () {

            const bookingLink =
                document.getElementById(
                    "supplierBookingLink"
                ).value;


            const message =
                "Here is your The Thekedar Store booking link. " +
                "Please share this link with customers:\n\n" +
                bookingLink;


            const whatsappURL =
                "https://wa.me/?text=" +
                encodeURIComponent(
                    message
                );


            window.open(
                whatsappURL,
                "_blank"
            );

        }
    );

}


/* INITIAL LOAD */

loadSupplier();

loadSupplierBookings();
