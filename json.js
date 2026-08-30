// تحميل المشاريع من JSON
fetch("projects.json")
.then(res => res.json())
.then(data => {
    let grid = document.getElementById("projectsGrid");

    data.forEach(project => {

        // قيم افتراضية لو JSON بسيط
        project.image   = project.image   || "project.png";
        project.level   = project.level   || "غير محدد";
        project.license = project.license || "مجاني";
        project.doc     = project.doc     || "#";
        project.page    = project.page    || "#";
        project.github  = project.github  || "https://github.com/asemdev";
        project.features = project.features || [
            "✔ مجاني بالكامل",
            "✔ سريع التحميل",
            "✔ مفتوح المصدر"
        ];

        let card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <span class="status">✅ ${project.status}</span>

            <img src="${project.image}" class="project-img">

            <h2>${project.name}</h2>

            <p><strong>الإصدار:</strong> ${project.version}</p>
            <p><strong>الترخيص:</strong> ${project.license}</p>
            <p><strong>المستوى:</strong> ${project.level}</p>

            <ul class="features">
                ${project.features.map(f => `<li>${f}</li>`).join("")}
            </ul>

            <div class="buttons">
                <a href="${project.page}">عرض المشروع</a>
                <a href="${project.doc}">التوثيق</a>
                <a href="download.php?file=${project.download}">تحميل</a>
                <a href="${project.github}" target="_blank" rel="noopener noreferrer">GitHub</a>
            </div>
        `;

        grid.appendChild(card);
    });
});

// البحث داخل كل محتوى البطاقة
function filterCards() {
    let input = document.getElementById("search").value.toLowerCase();
    let cards = document.querySelectorAll(".card");

    cards.forEach(card => {
        let text = card.innerText.toLowerCase();
        card.style.display = text.includes(input) ? "block" : "none";
    });
}
