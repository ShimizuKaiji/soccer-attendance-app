import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  remove,
  onValue
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyB5SBEkXWPGLKOob_g7-8vkhGmM3I-PRHA",
  authDomain: "soccer-attendance-app-e07f5.firebaseapp.com",
  databaseURL: "https://soccer-attendance-app-e07f5-default-rtdb.firebaseio.com",
  projectId: "soccer-attendance-app-e07f5",
  storageBucket: "soccer-attendance-app-e07f5.firebasestorage.app",
  messagingSenderId: "733928390",
  appId: "1:733928390:web:1dc259ac01916249cab0c7"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const nameInput = document.getElementById("nameInput");
const statusInput = document.getElementById("statusInput");
const commentInput = document.getElementById("commentInput");
const addButton = document.getElementById("addButton");
const attendanceList = document.getElementById("attendanceList");

const presentCount = document.getElementById("presentCount");
const absentCount = document.getElementById("absentCount");
const lateCount = document.getElementById("lateCount");

const attendanceRef = ref(db, "attendance");

addButton.addEventListener("click", async () => {
  const name = nameInput.value.trim();
  const status = statusInput.value;
  const comment = commentInput.value.trim();

  if (name === "") {
    alert("名前を入力してください");
    return;
  }

  const newData = {
    name: name,
    status: status,
    comment: comment,
    createdAt: Date.now()
  };

  try {
    await push(attendanceRef, newData);

    nameInput.value = "";
    statusInput.value = "出席";
    commentInput.value = "";
  } catch (error) {
    console.error("登録エラー:", error);
    alert("登録に失敗しました");
  }
});

onValue(attendanceRef, (snapshot) => {
  const data = snapshot.val();

  attendanceList.innerHTML = "";

  const attendanceData = [];

  if (data) {
    const entries = Object.entries(data);

    entries.sort((a, b) => b[1].createdAt - a[1].createdAt);

    entries.forEach(([id, item]) => {
      attendanceData.push(item);

      const li = document.createElement("li");

      li.innerHTML = `
        <div class="item-top">
          <div>
            <strong>${item.name}</strong>
            <span class="status">：${item.status}</span>
          </div>
          <button class="delete-btn" data-id="${id}">削除</button>
        </div>
        <div class="comment">${item.comment || "コメントなし"}</div>
      `;

      attendanceList.appendChild(li);
    });
  }

  updateCount(attendanceData);
});

function updateCount(attendanceData) {
  presentCount.textContent = attendanceData.filter(item => item.status === "出席").length;
  absentCount.textContent = attendanceData.filter(item => item.status === "欠席").length;
  lateCount.textContent = attendanceData.filter(item => item.status === "遅刻").length;
}

attendanceList.addEventListener("click", async (event) => {
  if (event.target.classList.contains("delete-btn")) {
    const id = event.target.dataset.id;

    try {
      await remove(ref(db, `attendance/${id}`));
    } catch (error) {
      console.error("削除エラー:", error);
      alert("削除に失敗しました");
    }
  }
});