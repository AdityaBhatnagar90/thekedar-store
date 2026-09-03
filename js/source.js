const params =
    new URLSearchParams(
        window.location.search
    );


const sourceCode =
    params.get("source");


/* SUPPLIER URL */

if (sourceCode) {

    localStorage.setItem(

        "sourceCode",

        sourceCode.trim()

    );

}


/* FIND SUPPLIER BY LOCATION */

async function findSupplierByLocation() {

    try {

        if (
            localStorage.getItem(
                "sourceCode"
            )
        ) {

            return;

        }


        if (!navigator.geolocation) {

            return;

        }


        navigator.geolocation.getCurrentPosition(

            async function (position) {

                const latitude =
                    position.coords.latitude;

                const longitude =
                    position.coords.longitude;


                const response =
                    await fetch(

                        "https://api.thekedar.store/api/suppliers/nearest",

                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify({

                                    latitude:
                                        latitude,

                                    longitude:
                                        longitude

                                })

                        }

                    );


                if (!response.ok) {

                    return;

                }


                const data =
                    await response.json();


                if (
                    data.supplier_code
                ) {

                    localStorage.setItem(

                        "sourceCode",

                        data.supplier_code

                    );

                    console.log(

                        "Supplier detected:",

                        data.supplier_code

                    );

                }

            },

            function (error) {

                console.log(
                    "Location unavailable"
                );

            }

        );

    }

    catch (error) {

        console.log(error);

    }

}


/* START LOCATION CHECK */

findSupplierByLocation();