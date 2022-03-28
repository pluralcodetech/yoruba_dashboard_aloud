
// Function for Registration
function signUp(event) {
    event.preventDefault();
    let getName = document.getElementById("name");
    let getEmail = document.getElementById("email");
    let getPass = document.getElementById("password");
    let confirmPass = document.getElementById("confirmPassword");
    let getNameValue = getName.value;
    let getEmailValue = getEmail.value;
    let getPassValue = getPass.value;
    let getConfirmValue = confirmPass.value;
    if (getNameValue == "" || getEmailValue == "" || getPassValue == "" || getConfirmValue == "") {
        Swal.fire({
            icon: 'info',
            text: 'All input fields are required',
            confirmButtonColor: '#2D85DE'
        });
    }
    else if (getConfirmValue !== getPassValue) {
        Swal.fire({
            icon: 'info',
            text: 'Passwords do not match',
            confirmButtonColor: '#2D85DE'
        });
    }
    else {
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        let SignOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify({
                "name": getNameValue,
                "email": getEmailValue,
                "password": getPassValue,
                "password_confirmation": getConfirmValue
            })
        };
        let url = "https://codesandbox.com.ng/yorubalearning/api/register_admin";
        console.log(getNameValue);
        fetch(url, SignOptions)
            .then(response => response.json())
            .then(result => {
            console.log(result);
            if (result.status === "success") {
                window.location.replace("index.html");
            }
        })
            .catch(error => console.log('error', error));
    }
}


// Function for Log in
function logIn(event) {
    event.preventDefault();
    const getLogEmail = document.getElementById("email");
    const getPassword = document.getElementById("password");
    const getLog = getLogEmail.value;
    const getPass = getPassword.value;
    if (getLog === "" || getPass === "") {
        Swal.fire({
            icon: 'info',
            text: 'All fields are required',
            confirmButtonColor: '#2D85DE'
        });
    }
    else {

        const formData = new FormData();
        formData.append("email", getLog);
        formData.append("password", getPass);

        const logOptions = {
            method: 'POST',
            body: formData,
            redirect: "follow"
        };
        const url = "https://codesandbox.com.ng/yorubalearning/api/admin_login";
        fetch(url, logOptions)
        .then(response => response.json())
        .then(result => {
            console.log(result);
            localStorage.setItem('loginData', JSON.stringify(result));
            let details = localStorage.getItem('loginData');
            let theDetails = JSON.parse(details)
            console.log(theDetails);
            if (theDetails.hasOwnProperty("email")) {
                window.location.href = "dashboard.html";
            }
            else {
                Swal.fire({
                    icon: 'info',
                    text: 'Incorrect Login Details',
                    confirmButtonColor: '#2D85DE'
                });
            }
        })
        .catch(error => console.log('error', error));
    }
}

// Function to create category
function createCategory(event) {
    event.preventDefault();

    const catName = document.getElementById("cat").value;
    const getImage = document.getElementById("imcat").files[0];
    const getForm = document.getElementById("catForm");

    if (catName === "" || getImage === "") {
        Swal.fire({
            icon: 'info',
            text: 'All fields are required',
            confirmButtonColor: '#2D85DE'
        });
    }
    else {
        const getToken = localStorage.getItem('loginData');
        const token = JSON.parse(getToken);
        const theToken = token.token;

        let catHeader = new Headers();
        catHeader.append("Authorization", `Bearer ${theToken}`);

        const fd = new FormData();
        fd.append("name", catName);
        fd.append("image", getImage);


        const catOptions = {
            method: 'POST',
            headers: catHeader,
            body: fd
        };

        const url = "https://codesandbox.com.ng/yorubalearning/api/admin/create_category";
        fetch(url, catOptions)
        .then(response => response.json())
        .then(result => {
            console.log(result)
            if (result.status === "success") {
                Swal.fire({
                    icon: 'success',
                    text: 'Category created successfully',
                    confirmButtonColor: '#2D85DE'
                })

                getForm.reset();
            }
            else {
                Swal.fire({
                    icon: 'info',
                    text: 'Unsuccessful',
                    confirmButtonColor: '#2D85DE'
                })
            }
        })
        .catch(error => console.log('error', error));

    }
}

// Function for category list
