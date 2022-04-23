const btn = document.getElementById("closeModal");
btn.onclick = function () {
  document.getElementById("errorModal").style.display = "none";
};
const err = document.getElementById("errorModal");
err.style.display = "none";
const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get("error");
document.getElementById("errorMessage").innerHTML = myParam;
if (myParam != null) err.style.display = "block";
