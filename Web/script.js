const baseUrl = 'http://localhost:3001/album/';
async function fetchData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        alert('Hiba történt:', error);
    }
}

async function displayAlbums() {
    const data = await fetchData(baseUrl);
    const div = document.getElementById('table');

    let table = '<table>';
    table += '<tr><th> </th><th>Band</th><th>Title</th><th>Release date</th><th>Genre</th><th>Actions</th></tr>';

    let counter = 1;
    data.forEach(album => {
        table += 
        `<tr>
            <td>${counter}</td>
            <td>${album.band}</td>
            <td>${album.title}</td>
            <td>${album.releaseDate}</td>
            <td>${album.genre}</td>
            <td>
                <button class="delete" onclick="confirmDelete('${album.id}')" title="Törlés">
                    <i class="fas fa-trash-alt"></i> <!-- Törlés ikon -->
                </button>
                <button class="edit" onclick="editAlbum('${album.id}', '${album.band}', '${album.title}', '${album.releaseDate}', '${album.genre}')" title="Szerkesztés">
                    <i class="fas fa-edit"></i> <!-- Szerkesztés ikon -->
                </button>
            </td>



        </tr>`;
        counter++;
    });

    table += '</table>';
    div.innerHTML = table;
}


async function createAlbum() {
    const band = document.getElementById("band");
    const title = document.getElementById("title");
    const releaseDate = document.getElementById("releaseDate");
    const genre = document.getElementById("genre");
    let isExist = false

    const data = await fetchData(baseUrl);
    data.forEach(album =>{
        if(album.title == title.value){
            isExist = true;
            return alert(title.value + " album már létezik!");
        }
    });

    if (!isExist) {
        try {
            const response = await fetch(baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ band: band.value, title: title.value, releaseDate: releaseDate.value, genre: genre.value})
                
            });
            if (response.ok) {
                displayAlbums();
            } else {
               return alert('Hiba történt a létrehozáskor.'+ response.error);
            }
        } catch (error) {
            return alert('Hiba történt:'+ error);
        }
    }
}

function editAlbum(id, band, title, releaseDate, genre) {
    document.getElementById("editId").value = id;
    document.getElementById("editBand").value = band;
    document.getElementById("editTitle").value = title;
    document.getElementById("editReleaseDate").value = releaseDate;
    document.getElementById("editGenre").value = genre;

    document.getElementById("editForm").style.display = "block";
    document.getElementById("editTitleHeading").style.display = "block";

    document.getElementById("editForm").scrollIntoView({ behavior: 'smooth' });
}
 
async function updateAlbum() {
    const id = document.getElementById("editId").value;
    const band = document.getElementById("editBand").value;
    const title = document.getElementById("editTitle").value;
    const releaseDate = document.getElementById("editReleaseDate").value;
    const genre = document.getElementById("editGenre").value;

    const updatedAlbum = {
        band,
        title,
        releaseDate,
        genre
    };

    try {
        const response = await fetch(baseUrl + id, {
            method: 'PUT', // vagy PATCH, ha a backend azt várja
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedAlbum)
        });

        if (response.ok) {
            document.getElementById("editForm").reset();
            document.getElementById("editForm").style.display = "none";
            document.getElementById("editTitleHeading").style.display = "none";
            displayAlbums();
        } else {
            alert("Hiba történt a szerkesztés során.");
        }
    } catch (error) {
        alert("Hiba történt: " + error.message);
    }
}

async function confirmDelete(id) {
    const confirmResult = confirm("Biztosan törölni akarja ezt az albumot?");
    if (!confirmResult) return;

    try {
        const response = await fetch(baseUrl + id, {
            method: 'DELETE'
        });
        if (response.ok) {
            displayAlbums();
        } else {
            alert('Hiba történt az album törlésekor.');
        }
    } catch (error) {
        alert('Hiba történt: ' + error.message);
    }
}

function toggleAddForm() {
    const formContainer = document.getElementById("addFormContainer");
    formContainer.style.display = formContainer.style.display === "none" ? "block" : "none";
}


displayAlbums();