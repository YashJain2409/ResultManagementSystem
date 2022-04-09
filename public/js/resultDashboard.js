const handleChange = async (e) => {
  const form = document.getElementById("result-form");
  if (document.contains(document.getElementById("subjects")))
    document.getElementById("subjects").remove();
  const cid = e.target.value;
  const params = new URLSearchParams({
    cid: cid,
  });
  const response = await fetch(`/dashboard/results/${cid}`);

  const json = await response.json();
  const subjects = json.subjects;
  const parentdiv = document.createElement("div");
  parentdiv.setAttribute("id", "subjects");
  subjects.forEach((subject, idx) => {
    const mydiv = document.createElement("div");
    mydiv.classList.add("form-group", "row");
    const mylab = document.createElement("label");
    mylab.classList.add("col-sm-2", "col-form-label", "label-style");
    var text = document.createTextNode(subject);
    mylab.appendChild(text);
    const inpdiv = document.createElement("div");
    inpdiv.classList.add("col-sm-10");
    const inp = document.createElement("input");
    inp.classList.add("form-control", "text-style");

    inp.setAttribute("name", subject);
    inp.setAttribute("placeholder", "enter marks");
    inp.setAttribute("type", "number");
    inpdiv.appendChild(inp);
    mydiv.appendChild(mylab);
    mydiv.appendChild(inpdiv);
    parentdiv.appendChild(mydiv);
  });
  form.insertBefore(parentdiv, form.children[2]);
};
document
  .getElementById("dropdown-classid")
  .addEventListener("change", handleChange);

var span = document.getElementsByClassName("close")[0];

var modal = document.getElementById("myModal");

async function getResultData() {
  const response = await fetch("/dashboard/getResults");

  const json = await response.json();
  const results = json.results;
  return { results: results };
}

async function createResultTable() {
  const tbody = document.getElementById("table-body");
  while (tbody.firstChild) {
    tbody.removeChild(tbody.lastChild);
  }
  const data = await getResultData();
  const results = data.results;

  let i = 1;
  results.forEach((item) => {
    const row = document.createElement("tr");
    const inp = document.createElement("input");
    inp.setAttribute("type", "hidden");
    inp.setAttribute("value", item._id);
    const th = document.createElement("th");
    const btn = document.createElement("button");
    btn.classList.add("btn", "btn-dark");
    btn.innerHTML = "See result";
    th.innerHTML = i;
    th.setAttribute("scope", "row");
    const td = document.createElement("td");
    td.innerHTML = item.student_id._id;
    const td1 = document.createElement("td");
    td1.innerHTML = item.student_id.class_id;
    const td2 = document.createElement("td");
    td2.innerHTML = item.student_id.name;
    const td3 = document.createElement("td");
    td3.appendChild(btn);
    const td4 = document.createElement("td");
    const iconDiv = document.createElement("div");
    const span = document.createElement("span");
    const span1 = document.createElement("span");
    const it = document.createElement("i");
    it.classList.add("fa-solid", "fa-trash");
    span.appendChild(it);
    span.setAttribute(
      "style",
      "font-size: 20px; margin-right: 10px; cursor: pointer;"
    );
    span.setAttribute("id", "btn-" + i.toString());

    iconDiv.append(span);
    iconDiv.setAttribute("style", "margin-top: 0;");
    td4.append(iconDiv);
    row.append(inp, th, td, td1, td2, td3, td4);
    tbody.appendChild(row);
    const delBtn = document.getElementById("btn-" + i.toString());
    delBtn.addEventListener("click", async (e) => {
      const inp =
        delBtn.parentElement.parentElement.parentElement.getElementsByTagName(
          "input"
        )[0];
      const id = inp.value;
      const response = await fetch(`/dashboard/results/?rid=${id}`, {
        method: "DELETE",
      });
      const json = await response.json();
      if (json.message == "deleted") location.reload();
    });
    i++;
    const ol = document.createElement("ol");
    ol.classList.add("list-group", "list-group-flush");
    item.result.forEach((resultItem) => {
      const listItem = document.createElement("li");
      listItem.classList.add("list-group-item");
      listItem.innerHTML = resultItem.name + ": " + resultItem.score;
      ol.appendChild(listItem);
    });
    btn.onclick = function () {
      const p = document.getElementById("sem");
      p.classList.add("lead");
      p.setAttribute("style", "margin-top : 3px;");
      p.innerHTML = "Sem : " + item.class_id.sem;
      const modalBody = document.getElementById("result");
      while (modalBody.firstChild) {
        modalBody.removeChild(modalBody.lastChild);
      }
      modalBody.appendChild(ol);
      modal.style.display = "block";
    };
  });
}

span.onclick = function () {
  modal.style.display = "none";
};
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

createResultTable();
