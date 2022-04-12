async function createStudentTable() {
  const tbody = document.getElementById("table-body");
  while (tbody.firstChild) {
    tbody.removeChild(tbody.lastChild);
  }
  const response = await fetch("/dashboard/getStudents");
  const json = await response.json();
  const students = json.students;
  let i = 1;
  students.forEach((student) => {
    const row = document.createElement("tr");
    const th = document.createElement("th");
    th.innerHTML = i;
    th.setAttribute("scope", "row");
    const td = document.createElement("td");
    td.innerHTML = student.class_id;
    const td1 = document.createElement("td");
    td1.innerHTML = student._id;
    const td2 = document.createElement("td");
    td2.innerHTML = student.name;
    const td3 = document.createElement("td");
    const iconDiv = document.createElement("div");
    const span = document.createElement("span");
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
    td3.append(iconDiv);
    row.append(th, td, td1, td2, td3);
    tbody.appendChild(row);
    const delBtn = document.getElementById("btn-" + i.toString());
    delBtn.addEventListener("click", async (e) => {
      const data =
        delBtn.parentElement.parentElement.parentElement.getElementsByTagName(
          "td"
        )[1];
      const id = data.innerHTML;
      const response = await fetch(`/dashboard/students/?sid=${id}`, {
        method: "DELETE",
      });
      const json = await response.json();
      if (json.message == "deleted") location.reload();
    });
    i++;
  });
  $(document).ready(function () {
    $("#student-table").DataTable();
  });
  if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
  }
}

createStudentTable();
