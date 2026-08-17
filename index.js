/**
 * @typedef puppy
 * @property {string} name
 * @property {string} breed
 * @property {string} status
 * @property {string} imageUrl
 * @property {number} teamId
 */

// === Constants ===
const BASE = "https://fsa-puppy-bowl.herokuapp.com/api";
const COHORT = "/2606-PUPPIES";
const RESOURCE = "/players";
const API = BASE + COHORT + RESOURCE;

//=== my state==
let puppies = [];
let selectedPuppy;

/* fetching from my api*/
async function getPuppies() {
  try {
    const res = await fetch(`${API}`);
    const json = await res.json();
    puppies = json.data.players;
    console.log(puppies);
    render();
  } catch (err) {
    console.error(err);
  }
}
/* updating my state with a single event*/
async function getPuppy(id) {
  try {
    const res = await fetch(`${API}/${id}`);
    const json = await res.json();
    selectedPuppy = json.data.player;
    render();
  } catch (err) {
    console.error(err);
  }
}
//=== form function
function newPuppyForm() {
  const $form = document.createElement("form");
  $form.innerHTML = `
  <label>
  Name
  <input name="name" required />
  </label>
  <label>
  Breed
  <input name="breed" required />
  </label>
  <label>
  Status
 <input name="status" required />
  <select id=statusSelect>
    <option value="">Select status</option>
    <option value="bench">Bench</option>
    <option value="field">Field</option>
  </select>
</label>
  </label>
  <label>
  Profile picture
  <input name="imageUrl" required />
  </label>
  <label>
  Team 
  <input name="teamId" required />
  </label>

  <button>Add Puppy Player</button>
  
  `;
  const $statusInput = $form.querySelector('input[name="status"]');
  const $statusSelect = $form.querySelector("#statusSelect");
  $statusSelect.addEventListener("change", function () {
    $statusInput.value = $statusSelect.value;
  });
  $form.addEventListener("submit", function (e) {
    e.preventDefault();
    const data = new FormData($form);
    const name = data.get("name");
    const breed = data.get("breed");
    const status = data.get("status");
    const imgUrl = data.get("imageUrl");
    const teamId = Number(data.get("teamId"));
    addPuppy({ name, breed, status, imageUrl: imgUrl, teamId });
  });

  return $form;
}

async function addPuppy(puppy) {
  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(puppy),
    });
    const json = await res.json();
    console.log("our data", json.data);

    if (res.status === 201) {
      getPuppies();
    }
  } catch (err) {
    console.error(err);
  }
}

async function getTeams() {
  try {
    const res = await fetch(`${BASE}${COHORT}/teams`);
    const json = await res.json();

    console.log("TEAMS:", json.data.teams);
  } catch (err) {
    console.error(err);
  }
}
/**
 *
 * @param {string | number} puppy
 * @returns
 */

async function removePuppy(id) {
  try {
    const res = await fetch(`${API}/${id}`, { method: "DELETE" });
    if (res.status === 200) {
      selectedPuppy = null;
      getPuppies();
    }
  } catch (err) {
    console.error(err);
  }
}
/// event name that wil; show more details when clicked
function PuppyListItem(puppy) {
  const $puppyListItem = document.createElement("li");
  $puppyListItem.innerHTML = `<a href="#">${puppy.name}</a>`;
  $puppyListItem.addEventListener("click", async function () {
    await getPuppy(puppy.id);
    console.log(selectedPuppy);
  });
  return $puppyListItem;
}
//list of all the events
function PuppyList() {
  const $puppyList = document.createElement("ul");
  $puppyList.classList.add("teamPlayers");
  const $puppies = puppies.map(PuppyListItem);
  $puppyList.replaceChildren(...$puppies);
  return $puppyList;
}

//== info about the team players
function PuppyDetails() {
  if (!selectedPuppy) {
    const $p = document.createElement("p");
    $p.textContent = "Please select an athlete to learn more";
    return $p;
  }

  const $puppyDetails = document.createElement("section");
  $puppyDetails.classList.add("teamPlayerInfo");
  $puppyDetails.innerHTML = `
    <h3>${selectedPuppy.name} #${selectedPuppy.id}</h3>

    <figure>
      <img
        alt="${selectedPuppy.name}"
        src="${selectedPuppy.imageUrl}"
      />
    </figure>
    <p>Team: ${selectedPuppy.teamId}</p>
    <p>Breed: ${selectedPuppy.breed}</p>
    <p>Status: ${selectedPuppy.status}</p>
    <button>Remove Puppy from roster</button>
  `;

  const $removeButton = $puppyDetails.querySelector("button");

  $removeButton.addEventListener("click", async function () {
    await removePuppy(selectedPuppy.id);
  });

  return $puppyDetails;
}

//==Render function
function render() {
  const $app = document.querySelector("#app");
  $app.innerHTML = `
    <h1> Puppy Athletes </h1>
    <main>
    <section>
    <h2> Star Puppy Players</h2>
    <PuppyList></PuppyList>
    </section>
    <section id="selected">
    <h2> Athlete Facts</h2>
    <PuppyDetails></PuppyDetails>
    </section>
    <section>
    <h2> Add a Puppy Player</h2>
    <NewPuppyForm></NewPuppyForm>
    </section>

    </main>

    `;
  $app.querySelector("PuppyList").replaceWith(PuppyList());
  $app.querySelector("PuppyDetails").replaceWith(PuppyDetails());
  $app.querySelector("NewPuppyForm").replaceWith(newPuppyForm());
}
async function init() {
  await getPuppies();
}
init();
getTeams();
