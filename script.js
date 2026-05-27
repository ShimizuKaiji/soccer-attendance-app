const nameInput = document.getElementById("nameInput");
const statusInput = document.getElementById("statusInput");
const commentInput = document.getElementById("commentInput");
const addButton = document.getElementById("addButton");
const attendanceList = document.getElementById("attendanceList");

const presentCount = document.getElementById("presentCount");
const absentCount = document.getElementById("absentCount");
const lateCount = document.getElementById("lateCount");

let attendanceData = JSON.parse(localStorage.getItem("attendanceData")) || [];

function saveData() {
  localStorage.setItem("attendanceData", JSON.stringify(attendanceData));
}

function renderList() {
  attendanceList.innerHTML = "";

  attendanceData.forEach((item, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <div class="item-top">
        <div>
          <strong>${item.name}</strong>
          <span class="status">：${item.status}</span>
        </div>
        <button class="delete-btn" onclick="deleteItem(${index})">削除</button>
      </div>
      <div class="comment">${item.comment || "コメントなし"}</div>
    `;

    attendanceList.appendChild(li);
  });

  updateCount();
}

function updateCount() {
  presentCount.textContent = attendanceData.filter(item => item.status === "出席").length;
  absentCount.textContent = attendanceData.filter(item => item.status === "欠席").length;
  lateCount.textContent = attendanceData.filter(item => item.status === "遅刻").length;
}

function addAttendance() {
  const name = nameInput.value.trim();
  const status = statusInput.value;
  const comment = commentInput.value.trim();

  if (name === "") {
    alert("名前を入力してください");
    return;
  }

  attendanceData.push({
    name: name,
    status: status,
    comment: comment
  });

  saveData();
  renderList();

  nameInput.value = "";
  statusInput.value = "出席";
  commentInput.value = "";
}

function deleteItem(index) {
  attendanceData.splice(index, 1);
  saveData();
  renderList();
}

addButton.addEventListener("click", addAttendance);

renderList();