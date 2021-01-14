const APIHOST = "http://localhost:5000/"
const fetchNotes = async () => (fetch(APIHOST+"allnotes/",)
    .then((response)=>response.json())
    .then((data)=>data)
    .catch((err)=>console.log("error while fetchinging notes"))
);

const addNote = async (note) => (
    fetch(APIHOST+'note/', {
        method: 'POST',
        body: JSON.stringify({note})
    }).then((response)=>response.json())
    .then((data)=>data)
    .catch((err)=>console.log("error while adding note"))
);

const delNote = async (id) => (
    fetch(APIHOST + `note/${id}`, {method: 'DELETE'})
    .then((response) => response.json())
    .then((data)=>true)
    .catch((error) => false)
)

export {
    fetchNotes, addNote, delNote
};