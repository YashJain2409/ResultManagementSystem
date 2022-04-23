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
  const x = document.getElementById("result-table");
  const y = document.getElementById("status");
  if (x != null) {
    x.remove();
  }
  if (y != null) {
    y.remove();
  }
  const printBtn = document.getElementById("print-button");
  document.getElementById("initial").style.display = "none";
  const tableContainer = document.getElementById("table-container");
  const table = document.createElement("table");
  table.setAttribute("id", "result-table");

  table.classList.add("table", "table-hover");
  const thead = document.createElement("thead");
  thead.classList.add("thead-dark");
  const tr = document.createElement("tr");
  const th1 = document.createElement("th");
  th1.innerHTML = "NO.";
  const th2 = document.createElement("th");
  th2.innerHTML = "SUBJECTS";
  const th3 = document.createElement("th");
  th3.innerHTML = "MARKS";
  const th4 = document.createElement("th");
  th4.innerHTML = "OUT OF";
  tr.append(th1, th2, th3, th4);
  thead.appendChild(tr);
  table.appendChild(thead);
  const tbody = document.createElement("tbody");
  tbody.style.textAlign = "center";
  thead.style.textAlign = "center";
  var percentage = 0.0;
  var sum = 0;
  let i = 1;
  if (resultData == null) {
    document.getElementById("initial").style.display = "block";
    document.getElementById("initial").innerHTML = "--No data found--";
    printBtn.style.display="none";
    return;
  }
  var percentage = 0.0;
  var sum = 0;
  var status = true;
  resultData.forEach((item) => {
    sum += item.score;
    if (item.score < 28) status = false;
    const row = document.createElement("tr");
    const th = document.createElement("th");
    th.innerHTML = i;
    const td = document.createElement("td");
    td.innerHTML = item.name;
    const td1 = document.createElement("td");
    td1.innerHTML = item.score;
    if (item.score < 28)
      td1.style.color = "rgb(" + 237 + "," + 90 + "," + 90 + ")";
    const td2 = document.createElement("td");
    td2.innerHTML = 70;
    row.append(th, td, td1, td2);
    tbody.appendChild(row);
    i++;
  });

  table.appendChild(tbody);

  const div = document.createElement("div");
  div.setAttribute("id", "status");
  div.classList.add("container");
  div.style.marginTop = "50px";
  div.style.textAlign = "center";
  const per = document.createElement("p");
  per.style.textAlign = "end";
  per.style.fontWeight = "700";
  const p = document.createElement("p");
  p.style.textAlign = "center";
  p.style.color = "#fff";

  if (status) {
    p.style.backgroundColor = "rgb(" + 107 + "," + 241 + "," + 112 + ")";
    p.innerHTML = "Status: pass";
  } else {
    p.style.backgroundColor = "rgb(" + 237 + "," + 90 + "," + 90 + ")";
    p.innerHTML = "Status: fail";
  }
  tableContainer.insertBefore(table, tableContainer.children[1]);
  tableContainer.insertBefore(div, tableContainer.children[2]);
  printBtn.style.display = "block";

  percentage = (sum / (70 * (i - 1))) * 100;
  percentage = percentage.toFixed(2);
  per.innerHTML = "Percentage: " + percentage + " %";
  div.appendChild(per);
  div.appendChild(p);
};
