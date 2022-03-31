
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
                // location.reload();
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
function getCatList() {
    const getScrollItem = document.querySelector(".scroll-object");
    const getToken = localStorage.getItem('loginData');
    const token = JSON.parse(getToken);
    const myToken = token.token;

    const listHeaders = new Headers();
    listHeaders.append("Authorization", `Bearer ${myToken}`);

    const listOptions = {
        method: 'GET',
        headers: listHeaders
    }

    let data = [];

    const url = "https://codesandbox.com.ng/yorubalearning/api/admin/category_list";

    fetch(url, listOptions)
    .then(response => response.json())
    .then(result => {
        console.log(result)
        result?.map((item) => {
            data += `
            <div class="search-card">
              <a href="details.html?id=${item.id}"><img src=${item.image} alt="image" /></a>
              <p>${item.name}</p>
              <div class="text-right">
                <button class="update-button" onclick="openModal(${item.id})">Update</buton>
                <button class="delete-button" onclick="deleteCategory(${item.id})">Delete</buton>
              </div>
            </div>
            `
            getScrollItem.innerHTML = data;
        })
    })
    .catch(error => console.log('error', error));
}

getCatList()

// Function for deleting a category
function deleteCategory(id) {
    const getDelToken = localStorage.getItem('loginData');
    const delToken = JSON.parse(getDelToken);
    const deleteToken = delToken.token;


    const deleteHeaders = new Headers();
    deleteHeaders.append("Authorization", `Bearer ${deleteToken}`);

    const deleteRequest = {
        method: 'GET',
        headers: deleteHeaders
    };

    const url = `https://codesandbox.com.ng/yorubalearning/api/admin/delete_category/` + `${id}`;

    fetch(url, deleteRequest)
    .then(response => response.json())
    .then(result => {
        console.log(result)

        if(result.status === "success") {
            location.reload();
        }else {
            Swal.fire({
                icon: 'info',
                text: 'Delete Unsuccessful!',
                confirmButtonColor: '#2D85DE'
            })
        }
    })
    .catch(error => console.log('error', error));
}

let getUnique;
// function for opening modal
function openModal(itemid) {
    localStorage.setItem("uniqueId", itemid)
    const getMyUnique = localStorage.getItem('uniqueId');
    const theUnique = JSON.parse(getMyUnique);
    getUnique = theUnique.id;
    console.log(getMyUnique);


    const getModal = document.getElementById("my-modal");
    getModal.style.display = "block"
}

// function to close modal
function closeModal() {
    const getModal = document.getElementById("my-modal");
    getModal.style.display = "none";
}

// function close close modal anywhere
window.onclick = function outsideClick(e) {
    const getModal = document.getElementById("my-modal");
    if (e.target == getModal) {
        getModal.style.display = "none";
    }
}

// function for updating category
function updateCategory(event) {
    event.preventDefault();
    
    const categoryName = document.getElementById("updateName").value;
    const categoryImage = document.getElementById("updateImage").files[0];

    if (categoryName === "" || categoryImage === "") {
        Swal.fire({
            icon: 'info',
            text: 'All fields are required',
            confirmButtonColor: '#2D85DE'
        })
    }
    else {
        const upToken = localStorage.getItem('loginData');
        const getUpToken = JSON.parse(upToken);
        const updateToken = getUpToken.token;

        const updateHeader = new Headers();
        updateHeader.append("Authorization", `Bearer ${updateToken}`);

        const updateData = new FormData();
        updateData.append("name", categoryName);
        updateData.append("image", categoryImage);
        updateData.append("category_id", getUnique);

        const updateRequest = {
            method: 'POST',
            headers: updateHeader,
            body: updateData
        };

        const url = "https://codesandbox.com.ng/yorubalearning/api/admin/update_category";

        fetch(url, updateRequest)
        .then(response => response.json())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
    }


}

