
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
                location.reload();
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
    getUnique = theUnique;
    console.log(getUnique);


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

        console.log(getUnique);

        const url = "https://codesandbox.com.ng/yorubalearning/api/admin/update_category";

        fetch(url, updateRequest)
        .then(response => response.json())
        .then(result => {
            console.log(result)
            if (result.status === "success") {
                location.reload();
            }
            else {
                Swal.fire({
                    icon: 'info',
                    text: 'Update Unsuccessful!',
                    confirmButtonColor: '#2D85DE'
                })
            }
        })
        .catch(error => console.log('error', error));
    }


}

// Function for details page
function getDetails() {
    const params = new URLSearchParams(window.location.search);
    let getId = params.get('id');

    const del = localStorage.getItem('loginData');
    const getDel = JSON.parse(del);
    const getTheDel = getDel.token;

    const delHeaders = new Headers();
    delHeaders.append("Authorization", `Bearer ${getTheDel}`);

    const delRequest = {
        method: 'GET',
        headers: delHeaders
    };

    let items = [];
    const url = `https://codesandbox.com.ng/yorubalearning/api/admin/category_details/` + `${getId}`;

    fetch(url, delRequest)
    .then(response => response.json())
    .then(result => {
        console.log(result)
        result?.map((item) => {
            items +=`
            <div class="box-img">
                <img src=${item.image}>
                <h2>${item.name}</h2>
                <div class="text-center">
                  <button class="update-button" onclick="openSubModal(${item.id})">Update</buton>
                </div>  
            </div>   
            `
            let info = document.querySelector(".subItems");
            info.innerHTML = items;
        })
    })
    .catch(error => console.log('error', error));
}

getDetails();

// Function for creating sub-category
function subCategory(event) {
    event.preventDefault();
    const getParams = new URLSearchParams(window.location.search);
    let id = getParams.get('id');

    const subToken = localStorage.getItem('loginData');
    const theSubToken = JSON.parse(subToken);
    const tokenSub = theSubToken.token;

    const subName = document.getElementById("subCatName").value;
    const subImage = document.getElementById("subCatImg").files[0];

    if (subName === "" || subImage === "") {
        Swal.fire({
            icon: 'info',
            text: 'All fields are required!',
            confirmButtonColor: '#2D85DE'
        })
    }
    else {
        const subHeaders = new Headers();
        subHeaders.append("Authorization", `Bearer ${tokenSub}`);

        const subData = new FormData();
        subData.append("name", subName);
        subData.append("image", subImage);
        subData.append("category_id", id);

        const subRequest = {
            method: 'POST',
            headers: subHeaders,
            body: subData
        };

        const url = "https://codesandbox.com.ng/yorubalearning/api/admin/create_subcategory";
        fetch(url, subRequest)
        .then(response => response.json())
        .then(result => {
            console.log(result)

            if (result.status === "success") {
                Swal.fire({
                    icon: 'success',
                    text: 'sub category created successfully',
                    confirmButtonColor: '#2D85DE'
                })
            }
            else {
                Swal.fire({
                    icon: 'info',
                    text: 'Unsuccessful!',
                    confirmButtonColor: '#2D85DE'
                })
            }
        })
        .catch(error => console.log('error', error));
    }

}


let subId;
// Fuction for opening sub Modal
function openSubModal(theId) {
    localStorage.setItem("subLogin", theId);
    const subUnique = localStorage.getItem("subLogin");
    const sub = JSON.parse(subUnique);
    subId = sub;

    const getModal = document.getElementById("my-modal");
    getModal.style.display = "block"
}

// Function for updating subcategory
function updateSubCategory(event) {
    event.preventDefault();

    const categorySubName = document.getElementById("updateSubName").value;
    const categorySubImage = document.getElementById("updateSubImage").files[0];

    if (categorySubName === "" || categorySubImage === "") {
        Swal.fire({
            icon: 'info',
            text: 'All fields are required',
            confirmButtonColor: '#2D85DE'
        })
    }

    else {
        const subCaToken = localStorage.getItem('loginData');
        const getSubCaToken = JSON.parse(subCaToken);
        const getTheSubToken = getSubCaToken.token;

        const subCaHeaders = new Headers();
        subCaHeaders.append("Authorization", `Bearer ${getTheSubToken}`);

        const subCatData = new FormData();
        subCatData.append("name", categorySubName);
        subCatData.append("image", categorySubImage);
        subCatData.append("subcategory_id", subId);

        const subCatRequest ={
            method: 'POST',
            headers: subCaHeaders,
            body: subCatData
        };

        const url = "https://codesandbox.com.ng/yorubalearning/api/admin/update_subcategory";

        fetch(url, subCatRequest)
        .then(response => response.json())
        .then(result => {
            console.log(result)
            if (result.status === "success") {
                location.reload();
            }else {
                Swal.fire({
                    icon: 'info',
                    text: 'Update Unsuccessful!',
                    confirmButtonColor: '#2D85DE'
                })
            }
        })
        .catch(error => console.log('error', error));
    }
}

