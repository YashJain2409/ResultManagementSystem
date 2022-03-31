const sem = parseInt(document.getElementById("sem").textContent);
const divSem = document.getElementById("dropdown-sem");
const btn = document.getElementById("dropdown-button");
const ul = document.createElement("ul");
const enrolment_no = document.getElementById("enrolment_no").innerHTML;
const branch = document.getElementById("branch").innerHTML;
const searchBtn = document.getElementById("searchResult");
searchBtn.disabled = true;
let resultData;
ul.classList.add("dropdown-menu");
for (let i = 1; i <= sem; i++) {
  const li = document.createElement("li");
  li.textContent = "Sem - " + i;
  li.classList.add("dropdown-item");
  ul.appendChild(li);
}
divSem.appendChild(ul);
const temp = document.querySelectorAll(".dropdown-item");
temp.forEach((item) => {
  item.addEventListener("click", async () => {
    btn.innerHTML = item.textContent;
    const sem = item.textContent[item.textContent.length - 1];
    const response = await fetch(
      `/result/?sem=${sem}&enrolment_no=${enrolment_no}&branch=${branch}`
    );
    const json = await response.json();
    resultData = json.result;
    searchBtn.disabled = false;
  });
});

searchBtn.onclick = () => {
  const tbody = document.getElementById("table-body");
  while (tbody.firstChild) {
    tbody.removeChild(tbody.lastChild);
  }
  let i = 1;
  
  resultData.forEach(item => {
       const row = document.createElement("tr");
       const th = document.createElement("th");
       th.innerHTML = i;
       th.setAttribute("scope","row");
       const td = document.createElement("td");
       td.innerHTML = item.name;
       const td1 = document.createElement("td");
       td1.innerHTML = item.score;
       const td2 = document.createElement("td");
       td2.innerHTML = 70;
       row.append(th,td,td1,td2);
       tbody.appendChild(row);
  });
}

