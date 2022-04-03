async function createStudentTable() {
  const tbody = document.getElementById("table-body");
  const response = await fetch("/dashboard/getStudents");
  const json = await response.json();
  console.log(json.students);
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
    const span1 = document.createElement("span");
    const it = document.createElement("i");
    it.classList.add("fa-solid","fa-trash");
    span.appendChild(it);
    span.setAttribute("style","font-size: 20px; margin-right: 10px; cursor: pointer;")
    const it1 = document.createElement("i");
    it1.classList.add("fa-solid","fa-pen-to-square");
    span1.setAttribute("style","font-size: 20px; cursor: pointer;")
    span1.appendChild(it1);
    iconDiv.append(span,span1);
    iconDiv.setAttribute("style","margin-top: 0;")
    td3.append(iconDiv);
    row.append(th, td, td1, td2,td3);
    tbody.appendChild(row);
    i++;
  });
}

createStudentTable();
