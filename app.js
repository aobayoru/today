// =========================
// Today V1
// =========================

console.log(
    "window.supabase =",
    window.supabase
);

const SUPABASE_URL =
"https://ithkvgyjvrbztmwxhyya.supabase.co";

const SUPABASE_KEY =
"sb_publishable_VrceITwhVpJksr7-8WTrMQ_J92BhKwQ";

const sbClient =
window.supabase.createClient(

    SUPABASE_URL,

    SUPABASE_KEY,

    {

        auth:{

            persistSession: true,

            autoRefreshToken: true,

            detectSessionInUrl: true,

            storage:
                window.localStorage,

            lock: async (
                _name,
                _acquireTimeout,
                fn
            )=>{

                return await fn();
            }
        }
    }
);

let renderedUserId;

console.log(
    "Supabase Client Created",
    sbClient
);

async function updateUserUI(
    knownSession
){

    let session =
        knownSession;

    if(
        knownSession ===
        undefined
    ){

        const result =

        await sbClient
        .auth
        .getSession();

        session =
            result.data.session;
    }

    if(
        session &&
        renderedUserId ===
        session.user.id &&
        document.getElementById(
            "logoutBtn"
        )
    ){

        return;
    }

    if(
        !session &&
        renderedUserId === null &&
        document.getElementById(
            "signupBtn"
        )
    ){

        return;
    }

    renderedUserId =
        session
        ? session.user.id
        : null;

    if(session){

        accountBtn.innerHTML = `

            <svg xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round">

                <circle cx="12" cy="12" r="10"/>

                <path d="m16 9-5.5 5.5L8 12"/>

            </svg>

        `;

        const profile =
            session.user.user_metadata
            ||
            {};

        const emailName =
            session.user.email
            .split("@")[0];

        accountCard.innerHTML = `

            <input
                id="profileName"
                class="profile-name"
                type="text"
                maxlength="32"
                aria-label="名字">

            <textarea
                id="profileMotto"
                class="profile-bio"
                maxlength="80"
                rows="3"
                aria-label="座右铭"></textarea>

            <div
                id="profileStats"
                class="profile-stats">

            </div>

        `;

        const oldLogout =
        document.getElementById(
            "logoutBtn"
        );

        if(oldLogout){

            oldLogout.remove();
        }

        const logoutBtn =
        document.createElement(
            "button"
        );

        logoutBtn.id =
            "logoutBtn";

        logoutBtn.textContent =
            "Logout";

        accountCard.insertAdjacentElement(
            "afterend",
            logoutBtn
        );

        const profileName =
        document.getElementById(
            "profileName"
        );

        const profileMotto =
        document.getElementById(
            "profileMotto"
        );

        profileName.value =

            typeof profile.display_name ===
            "string"
            &&
            profile.display_name.trim()

            ? profile.display_name

            : emailName;

        profileMotto.value =

            typeof profile.motto ===
            "string"

            ? profile.motto

            : "Build first.\nPolish later.";

        const saveProfile =
        async ()=>{

            const displayName =
                profileName.value.trim()
                ||
                emailName;

            const motto =
                profileMotto.value.trim();

            profileName.value =
                displayName;

            if(
                displayName ===
                profile.display_name
                &&
                motto ===
                profile.motto
            ){

                return;
            }

            const { error } =

            await sbClient
            .auth
            .updateUser({

                data:{

                    display_name:
                        displayName,

                    motto

                }

            });

            if(error){

                alert(
                    error.message
                );

                return;
            }

            profile.display_name =
                displayName;

            profile.motto =
                motto;
        };

        profileName.addEventListener(

            "keydown",

            event=>{

                if(
                    event.key ===
                    "Enter"
                ){

                    event.preventDefault();

                    profileName.blur();
                }
            }
        );

        profileName.addEventListener(
            "blur",
            saveProfile
        );

        profileMotto.addEventListener(
            "blur",
            saveProfile
        );

        renderProfileStats();

        document
        .getElementById(
            "logoutBtn"
        )
        .addEventListener(

            "click",

            async ()=>{

                await sbClient
                    .auth
                    .signOut();

                location.reload();

            }

        );

    }else{

        const oldLogout =
        document.getElementById(
            "logoutBtn"
        );

        if(oldLogout){

            oldLogout.remove();
        }

        accountBtn.textContent =
            "LOGIN";

        accountCard.innerHTML = `

        

            <input
                id="emailInput"
                class="auth-field"
                type="email"
                placeholder="Email"
                autocomplete="email">

            <input
                id="passwordInput"
                class="auth-field"
                type="password"
                placeholder="Password"
                autocomplete="current-password">

            <button
                id="signupBtn">

                Sign Up

            </button>

        `;
        document
        .getElementById("signupBtn")
        .addEventListener(

            "click",

            async ()=>{

                const email =
                    document
                    .getElementById(
                        "emailInput"
                    )
                    .value
                    .trim();

                const password =
                    document
                    .getElementById(
                        "passwordInput"
                    )
                    .value
                    .trim();

                const { error } =

                await sbClient
                .auth
                .signUp({

                    email,

                    password

                });

                if(error){

                    alert(
                        error.message
                    );

                    return;
                }

                alert(
                    "注册成功"
                );

            }

        );


    }

}


// -------------------------
// DOM
// -------------------------

const STORAGE_KEY = "today-v1";

const accountBtn =
document.getElementById(
    "accountBtn"
);


const taskInput =
document.getElementById(
    "taskInput"
);

const addBtn =
document.getElementById(
    "addBtn"
);

const todoList =
document.getElementById(
    "todoList"
);

const archiveList =
document.getElementById(
    "archiveList"
);

const dateLabel =
document.getElementById(
    "dateLabel"
);

const menuBtn =
document.getElementById(
    "menuBtn"
);

const backBtn =
document.getElementById(
    "backBtn"
);

const todayPage =
document.getElementById(
    "todayPage"
);

const archivePage =
document.getElementById(
    "archivePage"
);

const aboutPage =
document.getElementById(
    "aboutPage"
);

const aboutBtn =
document.getElementById(
    "aboutBtn"
);

const aboutBackBtn =
document.getElementById(
    "aboutBackBtn"
);

const detailPanel =
document.getElementById(
    "detailPanel"
);

const authPanel =
document.getElementById(
    "authPanel"
);

const emailInput =
document.getElementById(
    "emailInput"
);

const passwordInput =
document.getElementById(
    "passwordInput"
);

const loginBtn =
document.getElementById(
    "loginBtn"
);

const signupBtn =
document.getElementById(
    "signupBtn"
);

const themeBtn =
document.getElementById(
    "themeBtn"
);

accountBtn.addEventListener(

    "click",

    ()=>{

        authPanel.classList.toggle(
            "hidden"
        );

    }
);

// // signupBtn.addEventListener(

//     "click",

//     async ()=>{

//         const email =
//             emailInput.value.trim();

//         const password =
//             passwordInput.value.trim();

//         if(
//             !email ||
//             !password
//         ){

//             alert(
//                 "请输入邮箱和密码"
//             );

//             return;
//         }

//         const {

//             data,

//             error

//         } = await sbClient.auth.signUp({

//             email,

//             password

//         });

//         if(error){

//             alert(
//                 error.message
//             );

//             return;
//         }

//         alert(
//             "注册成功，请检查邮箱验证。"
//         );

//         console.log(
//             data
//         );
//     }
// );

accountBtn.addEventListener(

    "click",

    async ()=>{

        const email =
            document
            .getElementById(
                "emailInput"
            )
            .value
            .trim();

        const password =
            document
            .getElementById(
                "passwordInput"
            )
            .value
            .trim();

        if(
            !email ||
            !password
        ){

            alert(
                "请输入邮箱和密码"
            );

            return;
        }

        const {

            data,

            error

        }
        =
        await sbClient
        .auth
        .signInWithPassword({

            email,

            password

        });

        if(error){

            alert(
                error.message
            );

            return;
        }

        updateUserUI();

    }

);


// -------------------------
// 状态
// -------------------------
let selectedTaskId = null;

let selectedProjectId = null;

let state = {

    currentDate: "",

    today: [],

    someday: [],

    archive: {},

    projects: []
};

let currentMode =
    "today";

// -------------------------
// Project 预设图标
// -------------------------

const PROJECT_ICONS = [

    "📦",

    "🌱",

    "🌼",

    "🍀",

    "🌿",

    "📚",

    "💻",

    "🎨",

    "🎵",

    "📷",

    "✈️",

    "🏃",

    "☕",

    "📖",

    "🌙"
];

const DEFAULT_PROJECT_ICON = "📦";

const UNGROUPED_KEY = "ungrouped";

const expandedProjects = new Set([
    UNGROUPED_KEY
]);

// -------------------------
// Archive · someday 分组
// -------------------------

const SOMEDAY_ARCHIVE_KEY =
    "someday";

function somedayArchive(){

    if(!state.archive){

        state.archive = {};
    }

    if(
        !Array.isArray(
            state.archive[SOMEDAY_ARCHIVE_KEY]
        )
    ){

        state.archive[SOMEDAY_ARCHIVE_KEY] =
            [];
    }

    return state.archive[SOMEDAY_ARCHIVE_KEY];
}

// -------------------------
// 列表收起动画
// -------------------------

const COLLAPSE_DURATION = 360;

function collapseOut(element, done){

    if(!element){

        done();

        return;
    }

    if(
        element.classList.contains(
            "removing"
        )
    ){

        return;
    }

    // 连同父容器的 gap 一起收掉，剩余条目才能连贯上移

    const parent =
        element.parentElement;

    const gap = parent

        ? parseFloat(
            getComputedStyle(
                parent
            ).rowGap
        ) || 0

        : 0;

    element.style.maxHeight =
        element.offsetHeight + "px";

    void element.offsetWidth;

    element.classList.add(
        "removing"
    );

    element.style.maxHeight =
        "0px";

    element.style.marginBottom =
        (-gap) + "px";

    setTimeout(
        done,
        COLLAPSE_DURATION
    );
}

// -------------------------
// 日期
// -------------------------

function formatLocalDate(date){

    const month =
        String(date.getMonth() + 1)
        .padStart(2, "0");

    const day =
        String(date.getDate())
        .padStart(2, "0");

    return date.getFullYear()
        + "-"
        + month
        + "-"
        + day;
}

function getTodayString(){

    return formatLocalDate(
        new Date()
    );
}

function localDateKey(value){

    if(!value){

        return null;
    }

    const date =
        new Date(value);

    if(
        Number.isNaN(
            date.getTime()
        )
    ){

        return null;
    }

    return formatLocalDate(
        date
    );
}

// -------------------------
// 保存
// -------------------------

function saveState(){

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(
            state
        )
    );
}

// -------------------------
// 加载
// -------------------------

function loadState(){

    const raw =
        localStorage.getItem(
            STORAGE_KEY
        );

    if(raw){

        state =
            JSON.parse(raw);

        let needsSave = false;

        if(!state.someday){

            state.someday = [];

            needsSave = true;
        }

        if(!state.archive){

            state.archive = {};

            needsSave = true;
        }

        if(!Array.isArray(state.projects)){

            state.projects = [];

            needsSave = true;
        }

        if(needsSave){

            saveState();
        }

    }else{

        state = {

            currentDate:
                getTodayString(),

            today: [],

            someday: [],

            archive: {},

            projects: []
        };

        saveState();
    }

    checkDateChange();
}

// -------------------------
// 跨天归档
// -------------------------

function showEmptyDetail(){

    selectedTaskId = null;

    selectedProjectId = null;

    renderEmptyDetailContent();
}

function renderEmptyDetailContent(){

    const title =

        currentMode === "someday"
        ? "Someday"
        : "Today";

    detailPanel.innerHTML = `

        <div class="empty-detail">

            <div class="empty-title">

                ${title}

            </div>

            <div class="empty-subtitle">

                选择一个待办事项

            </div>

            <div class="empty-desc">

                在这里查看详细说明<br>
                并记录一些想法。

            </div>

        </div>

    `;

    updateAddBarState();
}

function checkDateChange(){

    const today =
        getTodayString();

    if(
        state.currentDate ===
        today
    ){

        return;
    }

    const previousToday =
        state.today.slice();

    if(
        previousToday.length
    ){

        state.archive[
            state.currentDate
        ] =

        JSON.parse(
            JSON.stringify(
                previousToday
            )
        );
    }

    const selectionCleared =
        previousToday.some(

            task =>
            task.id ===
            selectedTaskId
        );

    state.currentDate =
        today;

    state.today = [];

    saveState();

    if(!dateLabel){

        return;
    }

    renderDate();

    renderTodos();

    renderArchive();

    if(selectionCleared){

        showEmptyDetail();
    }

    loadTodosFromCloud();
}

function scheduleNextDayReset(){

    const now =
        new Date();

    const nextMidnight =
        new Date(

            now.getFullYear(),

            now.getMonth(),

            now.getDate() + 1,

            0,

            0,

            1
        );

    setTimeout(

        ()=>{

            checkDateChange();

            scheduleNextDayReset();

        },

        nextMidnight - now
    );
}

// -------------------------
// 日期显示
// -------------------------

function renderDate(){

    dateLabel.textContent =
        state.currentDate;
}

function renderProfileStats(){

    const stats =
    document.getElementById(
        "profileStats"
    );

    if(!stats){

        return;
    }

    const todayCount =
        state.today.length;

    const somedayCount =
        state.someday.length;

    const archivedCount =
    Object.values(
        state.archive || {}
    ).reduce(

        (sum, day)=>{

            if(
                !Array.isArray(day)
            ){

                return sum;
            }

            return sum + day.length;
        },

        0
    );

    stats.textContent = "";

    [

        ["🌱", todayCount, "Tasks"],

        ["🌿", somedayCount, "Someday"],

        ["📦", archivedCount, "Archived"]

    ].forEach(

        ([icon, count, label])=>{

            const line =
            document.createElement(
                "p"
            );

            line.textContent =
                icon
                + " "
                + count
                + " "
                + label;

            stats.appendChild(
                line
            );
        }
    );
}

// -------------------------
// Project
// -------------------------

const PROJECT_TABLE = "project";

function currentTasks(){

    return currentMode === "today"
        ? state.today
        : state.someday;
}

function projectsForMode(mode){

    return (state.projects || []).filter(
        project => project.mode === mode
    );
}

function selectedProject(){

    if(
        selectedProjectId === null ||
        selectedProjectId === undefined
    ){

        return null;
    }

    return projectsForMode(currentMode).find(

        project =>
            String(project.id) ===
            String(selectedProjectId)

    ) || null;
}

// Someday 的底部输入框：必须选中某个 Project 才能使用

function updateAddBarState(){

    if(currentMode === "someday"){

        if(
            selectedProjectId === null ||
            selectedProjectId === undefined
        ){

            taskInput.disabled = true;

            addBtn.disabled = true;

            taskInput.placeholder =
                "先选择一个项目";

            return;
        }

        const project = selectedProject();

        taskInput.disabled = false;

        addBtn.disabled = false;

        taskInput.placeholder = project
            ? `添加到 ${project.name}`
            : "添加到 未分组";

        return;
    }

    taskInput.disabled = false;

    addBtn.disabled = false;

    taskInput.placeholder = "";
}

function isProjectTask(task, projects){

    if(
        task.project_id === null ||
        task.project_id === undefined
    ){

        return false;
    }

    return projects.some(
        project =>
            String(project.id) ===
            String(task.project_id)
    );
}

function findGroupEl(id){

    const key = String(id);

    const groups = todoList.querySelectorAll(
        ".project-group"
    );

    for(const groupEl of groups){

        if(groupEl.dataset.projectKey === key){

            return groupEl;
        }
    }

    return null;
}

function markNewItem(id){

    const key = String(id);

    const items = todoList.querySelectorAll(
        ".todo-item"
    );

    for(const item of items){

        if(item.dataset.taskId === key){

            item.classList.add("new-item");

            return;
        }
    }
}

function refreshGroupCount(groupEl){

    if(!groupEl){

        return;
    }

    const countEl = groupEl.querySelector(
        ".project-count"
    );

    if(!countEl){

        return;
    }

    const tasks = currentTasks();

    const projects = projectsForMode(currentMode);

    const key = groupEl.dataset.projectKey;

    const count =

        key === UNGROUPED_KEY

        ? tasks.filter(
            task => !isProjectTask(task, projects)
        ).length

        : tasks.filter(
            task => String(task.project_id) === key
        ).length;

    countEl.textContent = count;
}

function setGroupExpanded(
    groupEl,
    expanded,
    animate
){

    const tasksEl = groupEl.querySelector(
        ".project-tasks"
    );

    if(!tasksEl){

        return;
    }

    if(!animate){

        tasksEl.style.transition = "none";

        groupEl.classList.toggle(
            "expanded",
            expanded
        );

        tasksEl.style.maxHeight =
            expanded ? "none" : "0px";

        void tasksEl.offsetHeight;

        tasksEl.style.transition = "";

        return;
    }

    if(expanded){

        groupEl.classList.add("expanded");

        if(tasksEl.style.maxHeight === "none"){

            return;
        }

        tasksEl.style.maxHeight =
            tasksEl.scrollHeight + "px";

        tasksEl.addEventListener(

            "transitionend",

            function handler(event){

                if(
                    event.target !== tasksEl ||
                    event.propertyName !==
                    "max-height"
                ){

                    return;
                }

                tasksEl.removeEventListener(
                    "transitionend",
                    handler
                );

                tasksEl.style.maxHeight = "none";
            }
        );

        return;
    }

    groupEl.classList.remove("expanded");

    if(tasksEl.style.maxHeight === "none"){

        tasksEl.style.maxHeight =
            tasksEl.scrollHeight + "px";

        void tasksEl.offsetHeight;
    }

    tasksEl.style.maxHeight = "0px";
}

function buildGroup(project, tasks){

    const isProject = Boolean(project);

    const key = isProject
        ? String(project.id)
        : UNGROUPED_KEY;

    const groupEl = document.createElement("li");

    groupEl.className = "project-group";

    groupEl.dataset.projectKey = key;

    // 重建后恢复选中高亮

    if(String(selectedProjectId) === key){

        groupEl.classList.add("selected");
    }

    const expanded = expandedProjects.has(key);

    const header = document.createElement("div");

    header.className = "project-header";

    header.innerHTML = `

        <span class="project-icon">
        ${isProject ? project.icon : "🧺"}
        </span>

        <span class="project-name">
        ${isProject ? project.name : "未分组"}
        </span>

        <span class="project-count">
        ${tasks.length}
        </span>

        <span class="project-arrow">
        ▸
        </span>

    `;

    const tasksEl = document.createElement("ul");

    tasksEl.className = "project-tasks";

    tasks.forEach(

        task =>
        tasksEl.appendChild(
            buildTaskItem(task, groupEl)
        )
    );

    groupEl.appendChild(header);

    groupEl.appendChild(tasksEl);

    header.addEventListener(

        "click",

        ()=>{

            const nowExpanded =

                !expandedProjects.has(key);

            if(nowExpanded){

                expandedProjects.add(key);

            }else{

                expandedProjects.delete(key);
            }

            setGroupExpanded(
                groupEl,
                nowExpanded,
                true
            );

            selectGroup(project);
        }
    );

    setGroupExpanded(groupEl, expanded, false);

    return groupEl;
}

function renderTodos(){

    todoList.innerHTML = "";

    const tasks = currentTasks();

    // Today：不分文件夹，直接平铺所有任务

    if(currentMode === "today"){

        sortTodayTasks(tasks).forEach(

            task =>
            todoList.appendChild(
                buildTaskItem(task, null)
            )
        );

        updateAddBarState();

        renderProfileStats();

        return;
    }

    // Someday：按 Project 分组

    const projects = projectsForMode("someday");

    const ungrouped = tasks.filter(
        task => !isProjectTask(task, projects)
    );

    if(ungrouped.length > 0){

        todoList.appendChild(
            buildGroup(null, ungrouped)
        );
    }

    projects.forEach(

        project=>{

            const groupTasks = tasks.filter(
                task =>
                    String(task.project_id) ===
                    String(project.id)
            );

            todoList.appendChild(
                buildGroup(project, groupTasks)
            );
        }
    );

    const newProjectRow =
        document.createElement("li");

    newProjectRow.className =
        "new-project-row";

    newProjectRow.textContent =
        "＋ New Project";

    newProjectRow.addEventListener(
        "click",
        addProject
    );

    todoList.appendChild(newProjectRow);

    updateAddBarState();

    renderProfileStats();
}

async function addTaskToProject(project, text){

    const target = currentTasks();

    const newTask = {

        id: Date.now(),

        text,

        detail: "",

        done: false,

        priority: 0,

        createdAt: Date.now(),

        project_id: project ? project.id : null
    };

    target.unshift(newTask);

    if(!project){

        expandedProjects.add(UNGROUPED_KEY);
    }

    saveState();

    renderTodos();

    markNewItem(newTask.id);

    // 云端插入后拿回真正的 id，并同步到 DOM，保证后续更新能命中

    const localId = newTask.id;

    await saveTodoToCloud(newTask);

    if(String(newTask.id) !== String(localId)){

        const li = todoList.querySelector(
            `.todo-item[data-task-id="${localId}"]`
        );

        if(li){

            li.dataset.taskId = String(newTask.id);
        }
    }
}

// -------------------------
// 跨文件夹移动（Someday）
// -------------------------

function moveSectionHTML(task){

    if(currentMode !== "someday"){

        return "";
    }

    const currentKey =

        task.project_id === null ||
        task.project_id === undefined

        ? UNGROUPED_KEY
        : String(task.project_id);

    const options = [

        {
            key: UNGROUPED_KEY,
            icon: "🧺",
            name: "未分组"
        }

    ].concat(

        projectsForMode("someday").map(
            project=>({

                key: String(project.id),

                icon: project.icon,

                name: project.name
            })
        )
    );

    // 只有一个去处（未分组）时不必显示

    if(options.length < 2){

        return "";
    }

    const buttons = options.map(

        option =>

        `<button
            type="button"
            class="move-target${
                option.key === currentKey
                ? " active"
                : ""
            }"
            data-key="${option.key}">

            <span class="move-icon">
            ${option.icon}
            </span>

            <span class="move-name">
            ${option.name}
            </span>

        </button>`

    ).join("");

    return `

        <div class="settings-label">
        移动到
        </div>

        <div class="move-list">
        ${buttons}
        </div>

    `;
}

function bindMoveTargets(task){

    const list =
        detailPanel.querySelector(".move-list");

    if(!list){

        return;
    }

    const projects = projectsForMode("someday");

    list.querySelectorAll(".move-target")
    .forEach(

        button=>{

            button.addEventListener(

                "click",

                ()=>{

                    if(
                        button.classList.contains(
                            "active"
                        )
                    ){

                        return;
                    }

                    const key = button.dataset.key;

                    const project =

                        key === UNGROUPED_KEY
                        ? null
                        : projects.find(
                            item =>
                                String(item.id) === key
                        ) || null;

                    moveTask(task, project, list);
                }
            );
        }
    );
}

function moveTask(task, project, listEl){

    const nextId =
        project ? project.id : null;

    const currentId =
        task.project_id === undefined
        ? null
        : task.project_id;

    if(String(currentId) === String(nextId)){

        return;
    }

    task.project_id = nextId;

    expandedProjects.add(
        project
        ? String(project.id)
        : UNGROUPED_KEY
    );

    saveState();

    updateTodoInCloud(
        task.id,
        { project_id: nextId }
    );

    renderTodos();

    markNewItem(task.id);

    if(!listEl){

        return;
    }

    listEl.querySelectorAll(".move-target")
    .forEach(
        button => button.classList.remove("active")
    );

    const active =
        listEl.querySelector(
            `.move-target[data-key="${
                project
                ? String(project.id)
                : UNGROUPED_KEY
            }"]`
        );

    if(active){

        active.classList.add("active");
    }
}

// -------------------------
// Priority（仅 Today）
// -------------------------

function taskPriority(task){

    return Number(task.priority) || 0;
}

function taskCreatedAt(task){

    return task.createdAt || Number(task.id) || 0;
}

// 高优先级在前；同一优先级按加入时间从早到晚；已完成沉底

function sortTodayTasks(tasks){

    return tasks.slice().sort(
        (a, b)=>{

            if(Boolean(a.done) !== Boolean(b.done)){

                return a.done ? 1 : -1;
            }

            const pa = taskPriority(a);

            const pb = taskPriority(b);

            if(pa !== pb){

                return pb - pa;
            }

            return taskCreatedAt(a) - taskCreatedAt(b);
        }
    );
}

function prioritySectionHTML(task){

    if(currentMode !== "today"){

        return "";
    }

    const value = taskPriority(task);

    return `

        <div class="priority-control">

            <div class="priority-head">

                <span class="settings-label">
                优先级
                </span>

                <span
                 class="priority-value"
                 id="priorityValue">${value}%</span>

            </div>

            <div
             class="priority-slider"
             id="prioritySlider"
             role="slider"
             aria-label="优先级"
             aria-valuemin="0"
             aria-valuemax="100"
             aria-valuenow="${value}"
             style="--p:${value}">

                <div class="priority-track"></div>

                <div class="priority-fill"></div>

                <span class="priority-star" style="left:18%">✦</span>

                <span class="priority-star" style="left:40%">✧</span>

                <span class="priority-star" style="left:62%">✦</span>

                <span class="priority-star" style="left:84%">✧</span>

                <div class="priority-thumb" id="priorityThumb"></div>

            </div>

        </div>

    `;
}

// 0% 白色 → 100% 紫色

function thumbRGB(pct){

    const t = pct / 100;

    const r = Math.round(255 + (124 - 255) * t);

    const g = Math.round(255 + (92 - 255) * t);

    const b = Math.round(255 + (255 - 255) * t);

    return `${r}, ${g}, ${b}`;
}

function priorityValueColor(pct){

    const t = pct / 100;

    const r = Math.round(154 + (107 - 154) * t);

    const g = Math.round(160 + (91 - 160) * t);

    const b = Math.round(180 + (214 - 180) * t);

    return `rgb(${r}, ${g}, ${b})`;
}

function bindPrioritySlider(task){

    const slider =
        document.getElementById("prioritySlider");

    if(!slider){

        return;
    }

    const thumb =
        document.getElementById("priorityThumb");

    const valueEl =
        document.getElementById("priorityValue");

    const render = pct=>{

        slider.style.setProperty(
            "--p",
            String(pct)
        );

        thumb.style.setProperty(
            "--thumb-rgb",
            thumbRGB(pct)
        );

        valueEl.textContent = pct + "%";

        valueEl.style.color =
            priorityValueColor(pct);

        slider.setAttribute(
            "aria-valuenow",
            String(pct)
        );
    };

    let current = taskPriority(task);

    render(current);

    const pctFromEvent = event=>{

        const rect =
            slider.getBoundingClientRect();

        if(!rect.width){

            return current;
        }

        const ratio =
            (event.clientX - rect.left) /
            rect.width;

        return Math.max(
            0,
            Math.min(100, Math.round(ratio * 100))
        );
    };

    let dragging = false;

    slider.addEventListener(
        "pointerdown",
        event=>{

            dragging = true;

            slider.classList.add("dragging");

            if(slider.setPointerCapture){

                slider.setPointerCapture(
                    event.pointerId
                );
            }

            current = pctFromEvent(event);

            render(current);
        }
    );

    slider.addEventListener(
        "pointermove",
        event=>{

            if(!dragging){

                return;
            }

            current = pctFromEvent(event);

            render(current);
        }
    );

    slider.addEventListener(
        "pointerup",
        async event=>{

            if(!dragging){

                return;
            }

            dragging = false;

            slider.classList.remove("dragging");

            if(
                slider.hasPointerCapture &&
                slider.hasPointerCapture(
                    event.pointerId
                )
            ){

                slider.releasePointerCapture(
                    event.pointerId
                );
            }

            // 数值未变就不重排

            if(taskPriority(task) === current){

                return;
            }

            task.priority = current;

            saveState();

            reorderTodayList();

            await updateTodoInCloud(
                task.id,
                { priority: current }
            );
        }
    );

    slider.addEventListener(
        "pointercancel",
        ()=>{

            dragging = false;

            slider.classList.remove("dragging");
        }
    );
}

// 按优先级就地重排今天列表（FLIP 动画，不重建节点）

function reorderTodayList(){

    if(currentMode !== "today"){

        return;
    }

    const items = Array.from(
        todoList.querySelectorAll(".todo-item")
    );

    if(!items.length){

        return;
    }

    const before = new Map();

    items.forEach(li=>{

        before.set(
            li,
            li.getBoundingClientRect().top
        );
    });

    sortTodayTasks(state.today).forEach(task=>{

        const li = items.find(
            item =>
                item.dataset.taskId ===
                String(task.id)
        );

        if(li){

            todoList.appendChild(li);
        }
    });

    items.forEach(li=>{

        const dy =
            before.get(li) -
            li.getBoundingClientRect().top;

        if(!dy){

            return;
        }

        li.style.transition = "none";

        li.style.transform =
            `translateY(${dy}px)`;

        void li.offsetHeight;

        li.style.transition =
            "transform .36s cubic-bezier(.4,0,.2,1)";

        li.style.transform = "";

        li.addEventListener(
            "transitionend",
            ()=>{

                li.style.transition = "";

                li.style.transform = "";
            },
            { once:true }
        );
    });
}

// -------------------------
// Project · Detail Panel
// -------------------------

// project 为 null 时表示「未分组」

function selectGroup(project){

    const key = project
        ? project.id
        : UNGROUPED_KEY;

    // 已选中：只做展开/收起，不重渲染详情面板

    if(String(selectedProjectId) === String(key)){

        return;
    }

    selectedTaskId = null;

    selectedProjectId = key;

    todoList
    .querySelectorAll(".todo-item.selected")
    .forEach(
        item => item.classList.remove("selected")
    );

    todoList
    .querySelectorAll(".project-group.selected")
    .forEach(
        item => item.classList.remove("selected")
    );

    const groupEl = findGroupEl(selectedProjectId);

    if(groupEl){

        groupEl.classList.add("selected");
    }

    if(project){

        renderProjectSettings(project);

    }else{

        renderEmptyDetailContent();
    }

    updateAddBarState();
}

function renderProjectSettings(project){

    detailPanel.innerHTML = `

        <div class="detail-content-fade project-settings">

            <div class="settings-title">

                Project Settings

            </div>

            <div class="settings-label">

                Name

            </div>

            <input
                id="projectNameInput"
                class="settings-name-input"
                type="text"
                maxlength="60"
                aria-label="项目名称">

            <div class="settings-label">

                Icon

            </div>

            <div class="icon-grid" id="iconGrid">

            </div>

            <button
                id="deleteProjectBtn"
                class="delete-project-btn">

                删除项目

            </button>

        </div>

    `;

    const nameInput = document.getElementById(
        "projectNameInput"
    );

    nameInput.value = project.name;

    nameInput.addEventListener(

        "keydown",

        event=>{

            if(event.key === "Enter"){

                event.preventDefault();

                nameInput.blur();
            }
        }
    );

    nameInput.addEventListener(

        "blur",

        ()=>{

            const next = nameInput.value.trim();

            if(!next){

                nameInput.value = project.name;

                return;
            }

            renameProject(project, next);
        }
    );

    const grid = document.getElementById("iconGrid");

    PROJECT_ICONS.forEach(

        icon=>{

            const btn =
                document.createElement("button");

            btn.type = "button";

            btn.className = "icon-choice";

            btn.textContent = icon;

            if(icon === project.icon){

                btn.classList.add("active");
            }

            btn.addEventListener(

                "click",

                ()=>{

                    setProjectIcon(project, icon);

                    grid
                    .querySelectorAll(".icon-choice")
                    .forEach(
                        item =>
                        item.classList.remove("active")
                    );

                    btn.classList.add("active");
                }
            );

            grid.appendChild(btn);
        }
    );

    document
    .getElementById("deleteProjectBtn")
    .addEventListener(
        "click",
        ()=> deleteProject(project)
    );
}

function renameProject(project, name){

    if(name === project.name){

        return;
    }

    project.name = name;

    saveState();

    updateProjectInCloud(project.id, { name });

    const groupEl = findGroupEl(project.id);

    if(groupEl){

        const nameEl = groupEl.querySelector(
            ".project-name"
        );

        if(nameEl){

            nameEl.textContent = name;
        }
    }
}

function setProjectIcon(project, icon){

    if(icon === project.icon){

        return;
    }

    project.icon = icon;

    saveState();

    updateProjectInCloud(project.id, { icon });

    const groupEl = findGroupEl(project.id);

    if(groupEl){

        const iconEl = groupEl.querySelector(
            ".project-icon"
        );

        if(iconEl){

            iconEl.textContent = icon;
        }
    }
}

function deleteProject(project){

    const ok = window.confirm(
        "删除项目「" +
        project.name +
        "」及其中的所有任务？"
    );

    if(!ok){

        return;
    }

    const key = String(project.id);

    state.today = state.today.filter(
        task => String(task.project_id) !== key
    );

    state.someday = state.someday.filter(
        task => String(task.project_id) !== key
    );

    Object.keys(state.archive || {}).forEach(

        date=>{

            if(!Array.isArray(state.archive[date])){

                return;
            }

            state.archive[date] =
            state.archive[date].filter(
                task => String(task.project_id) !== key
            );
        }
    );

    state.projects = state.projects.filter(
        item => String(item.id) !== key
    );

    expandedProjects.delete(key);

    saveState();

    deleteProjectFromCloud(project.id);

    if(String(selectedProjectId) === key){

        selectedProjectId = null;

        showEmptyDetail();
    }

    const groupEl = findGroupEl(project.id);

    const finish = ()=>{

        renderTodos();

        renderArchive();
    };

    if(groupEl){

        collapseOut(groupEl, finish);

    }else{

        finish();
    }
}

// -------------------------
// Project · 云同步
// -------------------------

async function saveProjectToCloud(project){

    const {
        data:{ session }
    } = await sbClient.auth.getSession();

    if(!session){

        return null;
    }

    const row = {

        user_id: session.user.id,

        name: project.name,

        icon: project.icon,

        mode: project.mode
    };

    const { data, error } = await sbClient

        .from(PROJECT_TABLE)

        .insert(row)

        .select()

        .single();

    console.log("PROJECT INSERT ERROR", error);

    return data || null;
}

async function updateProjectInCloud(id, fields){

    const { error } = await sbClient

        .from(PROJECT_TABLE)

        .update(fields)

        .eq("id", id);

    console.log("PROJECT UPDATE ERROR", error);
}

async function deleteProjectFromCloud(id){

    const { error } = await sbClient

        .from(PROJECT_TABLE)

        .delete()

        .eq("id", id);

    console.log("PROJECT DELETE ERROR", error);
}

async function loadProjectsFromCloud(){

    const {
        data:{ session }
    } = await sbClient.auth.getSession();

    if(!session){

        return;
    }

    const { data, error } = await sbClient

        .from(PROJECT_TABLE)

        .select("*");

    console.log("PROJECTS", data, error);

    if(!data){

        return;
    }

    state.projects = data.map(

        project => ({

            id: project.id,

            name: project.name || "新项目",

            icon:
                project.icon ||
                DEFAULT_PROJECT_ICON,

            mode: project.mode || "today"
        })
    );

    saveState();
}

async function addProject(){

    const draft = {

        name: "新项目",

        icon: DEFAULT_PROJECT_ICON,

        mode: currentMode
    };

    const saved = await saveProjectToCloud(draft);

    const project = {

        id: saved ? saved.id : Date.now(),

        name: draft.name,

        icon: draft.icon,

        mode: draft.mode
    };

    state.projects.push(project);

    expandedProjects.add(String(project.id));

    saveState();

    renderTodos();

    selectGroup(project);

    taskInput.focus();
}

// -------------------------
// Todo
// -------------------------

function buildTaskItem(task, groupEl){

            const li =
            document.createElement(
                "li"
            );

            li.className =
                "todo-item";

            li.dataset.taskId =
                String(task.id);

            if(task.done){

                li.classList.add(
                    "done"
                );
            }
            if(
                task.id ===
                selectedTaskId
            ){

                li.classList.add(
                    "selected"
                );
            }

            li.innerHTML = `

                <div
                 class="check">
                </div>

                <div
                 class="text">

                    ${task.text}

                </div>

                <button
                 class="delete-btn">

                    ×

                </button>

            `;

            // 完成
            
            li.querySelector(
            ".check"
        )
        .addEventListener(

            "click",

            ()=>{

                const newState =
                    !task.done;
                    if(!task.done){

                    const rect =
                    li.querySelector(
                        ".check"
                    ).getBoundingClientRect();

                    for(let i=0;i<6;i++){

                        const spark =
                        document.createElement(
                            "div"
                        );

                        spark.className =
                            "spark";

                        const colors = [

                            "#4f7cff",

                            "#ffb800",

                            "#ff6b6b",

                            "#7ed957",

                            "#ff87d7",

                            "#8a7dff"
                        ];

                        spark.style.background =

                            colors[
                                Math.floor(
                                    Math.random() *
                                    colors.length
                                )
                            ];

                        spark.style.left =
                            rect.left + 12 + "px";

                        spark.style.top =
                            rect.top + 12 + "px";

                        spark.style.setProperty(

                            "--x",

                            (Math.random()*100-50)
                            +"px"

                        );

                        spark.style.setProperty(

                            "--y",

                            (Math.random()*100-50)
                            +"px"

                        );

                        document.body.appendChild(
                            spark
                        );

                        setTimeout(
                            ()=>spark.remove(),
                            500
                        );
                    }
                }

                // Someday：打勾后自动消失，归入 Archive 的 someday 分组

                if(
                    currentMode ===
                    "someday"
                ){

                    task.done = true;

                    somedayArchive()
                    .unshift(

                        JSON.parse(
                            JSON.stringify(
                                task
                            )
                        )
                    );

                    state.someday =

                        state.someday.filter(

                            t =>

                            t.id !== task.id
                        );

                    if(
                        selectedTaskId ===
                        task.id
                    ){

                        selectedTaskId = null;

                        showEmptyDetail();
                    }

                    saveState();

                    collapseOut(

                        li,

                        ()=>{

                            // 只移除这一条，不重建整个列表

                            li.remove();

                            refreshGroupCount(groupEl);

                            renderProfileStats();

                            updateTodoInCloud(

                                task.id,

                                {
                                    done: true
                                }

                            );

                        }
                    );

                    return;
                }

                li.classList.toggle(
                    "done"
                );

                task.done =
                    newState;

                saveState();

                // Today：已完成沉到最底部

                reorderTodayList();

                updateTodoInCloud(

                    task.id,

                    {
                        done: newState
                    }

                );
            }
        );;

            // 删除

            li.querySelector(
                ".delete-btn"
            )
            .addEventListener(

                "click",

                ()=>{

                    collapseOut(

                        li,

                        ()=>{

                            li.remove();

                            deleteTodoFromCloud(
                                task.id
                            );

                            const target =

                                currentMode ===
                                "today"

                                ? state.today

                                : state.someday;

                            const updated =

                                target.filter(

                                    t=>

                                    t.id !==
                                    task.id
                                );

                            if(

                                currentMode ===
                                "today"
                            ){

                                state.today =
                                    updated;

                            }else{

                                state.someday =
                                    updated;
                            }

                            saveState();

                            refreshGroupCount(groupEl);

                            renderProfileStats();
                        }
                    );
                }
            );
            li.querySelector(
                ".text"
            )
            .addEventListener(

                "click",

                ()=>{

                    selectedTaskId =
                        task.id;

                    selectedProjectId =
                        null;

                    updateAddBarState();

                    document
                    .querySelectorAll(
                        ".todo-item"
                    )
                    .forEach(
                        item =>
                        item.classList.remove(
                            "selected"
                        )
                    );

                    document
                    .querySelectorAll(
                        ".project-group.selected"
                    )
                    .forEach(
                        item =>
                        item.classList.remove(
                            "selected"
                        )
                    );

                    li.classList.add(
                        "selected"
                    );

                    detailPanel.innerHTML = `

                    <div class="detail-content-fade">

                        <textarea
                            id="titleInput"
                            class="detail-title"
                            maxlength="200"
                            aria-label="待办内容"></textarea>

                        <textarea
                            id="detailInput"
                            class="detail-input"
                            placeholder="点击添加说明..."></textarea>

                        ${prioritySectionHTML(task)}

                        ${moveSectionHTML(task)}

                    </div>

                    `;
                    detailPanel.classList.remove(
                        "detail-fade"
                    );

                    void detailPanel.offsetWidth;

                    detailPanel.classList.add(
                        "detail-fade"
                    );

                    const titleInput =
                    document.getElementById(
                        "titleInput"
                    );

                    const detailInput =
                    document.getElementById(
                        "detailInput"
                    );

                    const textNode =
                    li.querySelector(
                        ".text"
                    );

                    titleInput.value =
                        task.text;

                    detailInput.value =
                        task.detail || "";

                    bindPrioritySlider(task);

                    bindMoveTargets(task);

                    const fitTitle = ()=>{

                        titleInput.style.height =
                            "auto";

                        titleInput.style.height =
                            titleInput.scrollHeight
                            + "px";
                    };

                    fitTitle();

                    titleInput.addEventListener(
                        "input",
                        fitTitle
                    );

                    titleInput.addEventListener(

                        "blur",

                        async ()=>{

                            const next =
                                titleInput.value
                                .trim();

                            if(!next){

                                titleInput.value =
                                    task.text;

                                fitTitle();

                                return;
                            }

                            if(
                                next ===
                                task.text
                            ){

                                return;
                            }

                            task.text =
                                next;

                            textNode.textContent =
                                next;

                            saveState();

                            await updateTodoInCloud(

                                task.id,

                                {
                                    text: next
                                }

                            );
                        }
                    );

                    detailInput.addEventListener(

                        "blur",

                        async ()=>{

                            console.log(task);
                            task.detail =
                                detailInput.value;

                            saveState();

                            await updateTodoInCloud(

                                task.id,

                                {
                                    detail:
                                        task.detail
                                }

                            );

                        }

                    );
                    

                    

                    

                }
            );
    return li;
}

// -------------------------
// 添加事项
// -------------------------
async function saveTodoToCloud(task){

    console.log("开始上传");

    const {
        data:{ session }
    } =
    await sbClient.auth.getSession();

    console.log(session);

    if(!session){

        return;
    }

    const row = {

        user_id:
            session.user.id,

        text:
            task.text,

        detail:
            task.detail,

        done:
            task.done,

        priority:
            task.priority || 0,

        mode:
            currentMode,

        day:
            getTodayString(),

        project_id:
            task.project_id === undefined
            ? null
            : task.project_id
    };

    let { data, error } =

    await sbClient

        .from("todo")

        .insert(row)

        .select()

        .single();

    if(
        error &&
        String(error.message)
        .includes("day")
    ){

        delete row.day;

        ({ data, error } =

        await sbClient

            .from("todo")

            .insert(row)

            .select()

            .single());
    }

    if(
        error &&
        String(error.message)
        .includes("project_id")
    ){

        delete row.project_id;

        ({ data, error } =

        await sbClient

            .from("todo")

            .insert(row)

            .select()

            .single());
    }

    if(
        error &&
        String(error.message)
        .includes("priority")
    ){

        delete row.priority;

        ({ data, error } =

        await sbClient

            .from("todo")

            .insert(row)

            .select()

            .single());
    }

    // 用云端返回的 id 回写本地任务，
    // 否则后续 update/delete 会按本地时间戳 id 打不中云端记录

    if(
        data &&
        data.id !== undefined &&
        data.id !== null
    ){

        task.id = data.id;

        saveState();
    }

    console.log(
        "ERROR",
        error
    );

    return data;

}

async function updateTodoInCloud(
    id,
    fields
){

    console.log(
        "UPDATE",
        id,
        fields
    );

    const { data,error } =

    await sbClient

        .from("todo")

        .update(
            fields
        )

        .eq("id", id)

        .select();

    console.log(
        "UPDATED DATA",
        data
    );

    console.log(
        "UPDATE ERROR",
        error
    );

}

async function deleteTodoFromCloud(id){

    const { error } =

    await sbClient

        .from("todo")

        .delete()

        .eq("id", id);

    console.log(
        "DELETE ERROR",
        error
    );
}



function cloudTodoDay(todo){

    return todo.day
        ||
        localDateKey(
            todo.created_at
        );
}

function isPastTodayTodo(
    todo,
    todayKey
){

    if(
        todo.mode ===
        "someday"
    ){

        return false;
    }

    const day =
        cloudTodoDay(todo);

    return Boolean(
        day &&
        day < todayKey
    );
}

async function archivePastTodayInCloud(
    staleIds
){

    if(!staleIds.length){

        return;
    }

    const updated =

    await sbClient

        .from("todo")

        .update({

            mode: "archive"

        })

        .in(
            "id",
            staleIds
        );

    if(updated.error){

        await sbClient

            .from("todo")

            .delete()

            .in(
                "id",
                staleIds
            );
    }
}

async function loadTodosFromCloud(){

    const {
        data:{ session }
    } =
    await sbClient.auth.getSession();

    if(!session){

        return;
    }

    const { data, error } =
    await sbClient

        .from("todo")

        .select("*");

    console.log("RAW", data);

    if(data){

        console.log("MODES",
            data.map(
                t => t.mode
            )
        );

    }

    console.log("TODOS", data);
    console.log("ERROR", error);

    if(data){

            const todayKey =
                getTodayString();

            const todayTasks = [];

            const somedayTasks = [];

            const staleIds = [];

            data.forEach(

                todo => {

                    const task = {

                        id: todo.id,

                        text: todo.text,

                        detail: todo.detail || "",

                        done: todo.done,

                        priority:
                            Number(todo.priority) || 0,

                        createdAt:
                            todo.created_at
                            ? new Date(
                                todo.created_at
                            ).getTime()
                            : Number(todo.id) || 0,

                        project_id:
                            todo.project_id === undefined
                            ? null
                            : todo.project_id
                    };

                    if(
                        todo.mode ===
                        "someday"
                    ){

                        if(todo.done){

                            // 已打勾的 someday 归入 Archive

                            const bucket =
                                somedayArchive();

                            const already =

                                bucket.some(

                                    item =>

                                    item.id ===
                                    task.id
                                );

                            if(!already){

                                bucket.push(
                                    task
                                );
                            }

                        }else{

                            somedayTasks.push(
                                task
                            );
                        }

                        return;
                    }

                    const past =

                        todo.mode ===
                        "archive"
                        ||
                        isPastTodayTodo(
                            todo,
                            todayKey
                        );

                    if(past){

                        const day =

                            cloudTodoDay(
                                todo
                            )
                            ||
                            todayKey;

                        if(
                            !state.archive[day]
                        ){

                            state.archive[day] =
                                [];
                        }

                        const already =

                            state.archive[day]
                            .some(

                                item =>

                                item.id ===
                                task.id
                                ||
                                item.text ===
                                task.text
                            );

                        if(!already){

                            state.archive[day]
                            .push(task);
                        }

                        if(
                            todo.mode ===
                            "today"
                        ){

                            staleIds.push(
                                todo.id
                            );
                        }

                        return;
                    }

                    todayTasks.push(
                        task
                    );
                }
            );

            await archivePastTodayInCloud(
                staleIds
            );

            state.today =
                todayTasks;

            state.someday =
                somedayTasks;

            state.currentDate =
                todayKey;

            saveState();

        renderTodos();

        renderArchive();

    }

}


async function addTask(){

    const text =
        taskInput.value.trim();

    if(!text){

        return;
    }

    // Someday：只把任务加进当前选中的 Project

    if(currentMode === "someday"){

        if(
            selectedProjectId === null ||
            selectedProjectId === undefined
        ){

            return;
        }

        taskInput.value = "";

        // selectedProject() 为 null 时表示「未分组」

        await addTaskToProject(selectedProject(), text);

        return;
    }

    const newTask = {

        id:
            Date.now(),

        text,

        detail:"",

        done:false,

        priority: 0,

        createdAt: Date.now(),

        project_id:null
    };

    state.today.unshift(
        newTask
    );


    taskInput.value = "";

    saveState();

    renderTodos();

    markNewItem(
        newTask.id
    );

    // 云端插入后拿回真正的 id，并同步到 DOM，保证后续更新能命中

    const localId = newTask.id;

    await saveTodoToCloud(
        newTask
    );

    if(String(newTask.id) !== String(localId)){

        const li = todoList.querySelector(
            `.todo-item[data-task-id="${localId}"]`
        );

        if(li){

            li.dataset.taskId = String(newTask.id);
        }
    }
}

addBtn.addEventListener(

    "click",

    addTask
);

const somedayBtn =
document.getElementById(
    "somedayBtn"
);

const pageTitle =
document.getElementById(
    "pageTitle"
);

somedayBtn.addEventListener(

    "click",

    ()=>{

        if(
            currentMode ===
            "today"
        ){

            currentMode =
                "someday";

            pageTitle.textContent =
                "Someday";

            pageTitle.classList.remove(
                "title-switch"
            );

            void pageTitle.offsetWidth;

            pageTitle.classList.add(
                "title-switch"
            );

        }else{

            currentMode =
                "today";

            pageTitle.textContent =
                "Today";

            pageTitle.classList.remove(
                "title-switch"
            );

            void pageTitle.offsetWidth;

            pageTitle.classList.add(
                "title-switch"
            );
        }

        
         selectedTaskId = null;

        selectedProjectId = null;

        showEmptyDetail();

        renderTodos();
    }
);  

taskInput.addEventListener(

    "keydown",

    e=>{

        if(
            e.key === "Enter"
        ){

            addTask();
        }
    }
);

// -------------------------
// Archive
// -------------------------

// 列表 ↔ 某天详情 的滑动淡入淡出

const ARCHIVE_VIEW_DURATION = 220;

let archiveViewBusy = false;

function switchArchiveView(render, direction){

    if(archiveViewBusy){

        return;
    }

    archiveViewBusy = true;

    const back =
        direction === "back";

    const outClass =
        back
        ? "archive-view-out-right"
        : "archive-view-out-left";

    const inClass =
        back
        ? "archive-view-in-left"
        : "archive-view-in-right";

    archiveList.classList.add(outClass);

    setTimeout(()=>{

        render();

        archiveList.classList.remove(outClass);

        archiveList.classList.add(inClass);

        // 强制回流，让起始位移立即生效

        void archiveList.offsetWidth;

        archiveList.classList.remove(inClass);

        archiveViewBusy = false;

    }, ARCHIVE_VIEW_DURATION);
}

function renderArchive(){

    renderProfileStats();

    archiveList.innerHTML = "";

    const somedayTasks =
        somedayArchive();

    const dates =

    Object.keys(
        state.archive
    )

    .filter(

        date =>

        date !== SOMEDAY_ARCHIVE_KEY
    )

    .sort().reverse();

    if(
        dates.length === 0 &&
        somedayTasks.length === 0
    ){

        const empty =
            document.createElement(
                "div"
            );

        empty.className =
            "archive-empty";

        empty.textContent =
            "还没有归档记录";

        archiveList.appendChild(
            empty
        );

        return;
    }

    // 置顶：已完成的 Someday

    archiveList.appendChild(

        buildArchiveSummary({

            key:
                SOMEDAY_ARCHIVE_KEY,

            icon:"🌿",

            title:"Someday",

            meta:"已完成的 Someday",

            count:
                somedayTasks.length,

            accent:true
        })
    );

    dates.forEach(

        date=>{

            const tasks =
                state.archive[date] || [];

            const weekday =
                archiveWeekday(date);

            archiveList.appendChild(

                buildArchiveSummary({

                    key:date,

                    title:
                        archiveDateLabel(
                            date
                        ),

                    meta:
                        [
                            weekday,
                            tasks.length +
                            " 条"
                        ]
                        .filter(Boolean)
                        .join(" · "),

                    count:
                        tasks.length
                })
            );
        }
    );
}

// -------------------------
// Archive · 日期显示与列表行
// -------------------------

const ARCHIVE_WEEKDAYS = [
    "周日",
    "周一",
    "周二",
    "周三",
    "周四",
    "周五",
    "周六"
];

function archiveDateParts(date){

    const parts =
        String(date).split("-");

    if(parts.length !== 3){

        return null;
    }

    const y = Number(parts[0]);

    const m = Number(parts[1]);

    const d = Number(parts[2]);

    if(!y || !m || !d){

        return null;
    }

    return { y, m, d };
}

function archiveDateLabel(date){

    const parts =
        archiveDateParts(date);

    if(!parts){

        return String(date);
    }

    return `${parts.y}年${parts.m}月${parts.d}日`;
}

function archiveWeekday(date){

    const parts =
        archiveDateParts(date);

    if(!parts){

        return "";
    }

    const d = new Date(
        parts.y,
        parts.m - 1,
        parts.d
    );

    return ARCHIVE_WEEKDAYS[
        d.getDay()
    ] || "";
}

function buildArchiveSummary({
    key,
    icon,
    title,
    meta,
    count,
    accent
}){

    const row =
        document.createElement(
            "div"
        );

    row.className =
        "archive-item archive-summary" +
        (accent
            ? " archive-someday"
            : "");

    const main =
        document.createElement(
            "div"
        );

    main.className =
        "archive-summary-main";

    if(icon){

        const iconEl =
            document.createElement(
                "span"
            );

        iconEl.className =
            "archive-summary-icon";

        iconEl.textContent = icon;

        main.appendChild(iconEl);
    }

    const texts =
        document.createElement(
            "div"
        );

    texts.className =
        "archive-summary-texts";

    const titleEl =
        document.createElement(
            "strong"
        );

    titleEl.className =
        "archive-date";

    titleEl.textContent = title;

    texts.appendChild(titleEl);

    if(meta){

        const metaEl =
            document.createElement(
                "span"
            );

        metaEl.className =
            "archive-meta";

        metaEl.textContent = meta;

        texts.appendChild(metaEl);
    }

    main.appendChild(texts);

    row.appendChild(main);

    const right =
        document.createElement(
            "span"
        );

    right.className =
        "archive-summary-right";

    const countEl =
        document.createElement(
            "span"
        );

    countEl.className =
        "archive-count";

    countEl.textContent =
        String(count);

    right.appendChild(countEl);

    const chevron =
        document.createElement(
            "span"
        );

    chevron.className =
        "archive-chevron";

    chevron.textContent = "›";

    right.appendChild(chevron);

    row.appendChild(right);

    row.addEventListener(

        "click",

        ()=>{

            switchArchiveView(

                ()=>{

                    renderArchiveDay(key);
                },

                "forward"
            );
        }
    );

    return row;
}

// 归档任务行（Someday / 日期）

function buildArchiveTask(task, actions){

    const item =
        document.createElement(
            "div"
        );

    item.className =
        "archive-item archive-task-item";

    const text =
        document.createElement(
            "div"
        );

    text.className =
        "archive-task-text";

    const mark =
        document.createElement(
            "span"
        );

    mark.className =
        "archive-task-mark" +
        (task.done ? " done" : "");

    mark.textContent =
        task.done ? "✓" : "○";

    text.appendChild(mark);

    const label =
        document.createElement(
            "span"
        );

    label.className =
        "archive-task-label";

    label.textContent = task.text;

    text.appendChild(label);

    const actionsEl =
        document.createElement(
            "div"
        );

    actionsEl.className =
        "archive-task-actions";

    actions.forEach(

        action=>{

            const btn =
                document.createElement(
                    "button"
                );

            btn.type = "button";

            btn.className =
                "archive-action-btn" +
                (action.danger
                    ? " archive-action-danger"
                    : "");

            btn.textContent =
                action.label;

            btn.addEventListener(

                "click",

                event=>{

                    event.stopPropagation();

                    collapseOut(
                        item,
                        action.onClick
                    );
                }
            );

            actionsEl.appendChild(btn);
        }
    );

    item.appendChild(text);

    item.appendChild(actionsEl);

    return item;
}

// -------------------------
// 查看历史
// -------------------------

function renderArchiveDay(date){

    const isSomeday =

        date ===
        SOMEDAY_ARCHIVE_KEY;

    const tasks =

        isSomeday

        ? somedayArchive()

        : (state.archive[date] || []);

    archiveList.innerHTML = "";

    const back =
        document.createElement(
            "button"
        );

    back.type = "button";

    back.className =
        "archive-back";

    back.textContent =
        "← 返回";

    back.addEventListener(

        "click",

        ()=>{

            switchArchiveView(
                renderArchive,
                "back"
            );
        }
    );

    archiveList.appendChild(
        back
    );

    const title =
        document.createElement(
            "div"
        );

    title.className =
        "archive-detail-title";

    title.textContent =

        isSomeday

        ? "Someday"

        : archiveDateLabel(date);

    archiveList.appendChild(
        title
    );

    if(tasks.length === 0){

        const empty =
            document.createElement(
                "div"
            );

        empty.className =
            "archive-empty";

        empty.textContent =
            isSomeday
            ? "还没有完成的 Someday"
            : "这一天没有记录";

        archiveList.appendChild(
            empty
        );

        return;
    }

    tasks.forEach(

        task=>{

            if(isSomeday){

                archiveList.appendChild(

                    buildArchiveTask(task, [

                        {

                            label:
                                "移回 Someday",

                            onClick:
                                ()=>{

                                    restoreSomedayTask(
                                        task.id
                                    );
                                }
                        },

                        {

                            label:"删除",

                            danger:true,

                            onClick:
                                ()=>{

                                    deleteSomedayArchiveTask(
                                        task.id
                                    );
                                }
                        }
                    ])
                );

                return;
            }

            archiveList.appendChild(

                buildArchiveTask(task, [

                    {

                        label:"移回 Today",

                        onClick:
                            ()=>{

                                restoreTodayArchiveTask(
                                    task.id,
                                    date
                                );
                            }
                    }
                ])
            );
        }
    );
}

// -------------------------
// 归档的 Someday：移回 / 删除
// -------------------------

function restoreSomedayTask(id){

    const bucket =
        somedayArchive();

    const task =

        bucket.find(

            t =>

            t.id === id
        );

    if(!task){

        return;
    }

    task.done = false;

    state.archive[SOMEDAY_ARCHIVE_KEY] =

        bucket.filter(

            t =>

            t.id !== id
        );

    if(
        !state.someday.some(

            t =>

            t.id === id
        )
    ){

        state.someday.unshift(
            task
        );
    }

    saveState();

    updateTodoInCloud(

        id,

        {
            done: false
        }
    );

    if(currentMode === "someday"){

        renderTodos();
    }

    renderArchiveDay(
        SOMEDAY_ARCHIVE_KEY
    );
}

function deleteSomedayArchiveTask(id){

    state.archive[SOMEDAY_ARCHIVE_KEY] =

        somedayArchive()
        .filter(

            t =>

            t.id !== id
        );

    saveState();

    deleteTodoFromCloud(id);

    renderArchiveDay(
        SOMEDAY_ARCHIVE_KEY
    );
}

// -------------------------
// 归档的 Today：移回 Today
// -------------------------

function restoreTodayArchiveTask(id, date){

    const bucket =
        state.archive[date] || [];

    const task =

        bucket.find(

            t =>

            t.id === id
        );

    if(!task){

        return;
    }

    task.done = false;

    const rest =

        bucket.filter(

            t =>

            t.id !== id
        );

    const isEmpty =
        rest.length === 0;

    if(isEmpty){

        delete state.archive[date];

    }else{

        state.archive[date] =
            rest;
    }

    if(
        !state.today.some(

            t =>

            t.id === id
        )
    ){

        state.today.unshift(
            task
        );
    }

    saveState();

    restoreTodayInCloud(id);

    if(currentMode === "today"){

        renderTodos();
    }

    // 该日期已清空就退回列表，否则停留在当天

    if(isEmpty){

        renderArchive();

    }else{

        renderArchiveDay(date);
    }
}

async function restoreTodayInCloud(id){

    const fields = {

        done: false,

        mode: "today",

        day: getTodayString()
    };

    let { error } =

    await sbClient

        .from("todo")

        .update(fields)

        .eq("id", id)

        .select();

    // 云端若没有 day 列，去掉后再试一次

    if(
        error &&
        String(error.message)
        .includes("day")
    ){

        delete fields.day;

        ({ error } =

        await sbClient

            .from("todo")

            .update(fields)

            .eq("id", id)

            .select());
    }

    console.log(
        "RESTORE TODAY ERROR",
        error
    );
}

// -------------------------
// 页面切换
// -------------------------

let pageAnimating = false;

function switchPage(
    from,
    to,
    direction
){

    if(pageAnimating){

        return;
    }

    window.scrollTo(0, 0);

    const enterClass =

        direction === "forward"
        ? "page-from-right"
        : "page-from-left";

    const leaveClass =

        direction === "forward"
        ? "page-to-left"
        : "page-to-right";

    pageAnimating = true;

    to.classList.remove(
        "hidden"
    );

    to.classList.add(
        "page-pre",
        enterClass
    );

    void to.offsetWidth;

    to.classList.remove(
        "page-pre",
        enterClass
    );

    from.classList.add(
        leaveClass
    );

    let finished = false;

    const finish = ()=>{

        if(finished){

            return;
        }

        finished = true;

        from.classList.add(
            "hidden"
        );

        from.classList.remove(
            leaveClass
        );

        pageAnimating = false;
    };

    from.addEventListener(

        "transitionend",

        event=>{

            if(
                event.target === from &&
                event.propertyName ===
                "opacity"
            ){

                finish();
            }
        }
    );

    setTimeout(
        finish,
        620
    );
}

function showArchive(){

    renderArchive();

    switchPage(
        todayPage,
        archivePage,
        "forward"
    );
}

function showAbout(){

    switchPage(
        todayPage,
        aboutPage,
        "forward"
    );
}

function showTodayFromAbout(){

    switchPage(
        aboutPage,
        todayPage,
        "back"
    );
}

function showToday(){

    switchPage(
        archivePage,
        todayPage,
        "back"
    );
}

menuBtn.addEventListener(

    "click",

    showArchive
);

backBtn.addEventListener(

    "click",

    showToday
);

aboutBtn.addEventListener(

    "click",

    showAbout
);

aboutBackBtn.addEventListener(

    "click",

    showTodayFromAbout
);

// -------------------------
// Theme（夜间模式）
// -------------------------

const THEME_KEY = "today-theme";

const darkQuery =
window.matchMedia(
    "(prefers-color-scheme: dark)"
);

function savedTheme(){

    try{

        const value =
        localStorage.getItem(
            THEME_KEY
        );

        if(
            value === "day" ||
            value === "night"
        ){

            return value;
        }

    }catch(e){}

    return null;
}

function systemTheme(){

    return darkQuery.matches
    ? "night"
    : "day";
}

function applyTheme(theme){

    document
    .documentElement
    .dataset
    .theme = theme;

    if(themeBtn){

        themeBtn.textContent =
        theme === "night"
        ? "☀️"
        : "🌙";
    }
}

function currentTheme(){

    return document
    .documentElement
    .dataset
    .theme === "night"
    ? "night"
    : "day";
}

function toggleTheme(){

    const next =
    currentTheme() === "night"
    ? "day"
    : "night";

    try{

        localStorage.setItem(
            THEME_KEY,
            next
        );

    }catch(e){}

    applyTheme(next);
}

applyTheme(
    savedTheme() || systemTheme()
);

themeBtn.addEventListener(

    "click",

    toggleTheme
);

darkQuery.addEventListener(

    "change",

    ()=>{

        if(!savedTheme()){

            applyTheme(
                systemTheme()
            );
        }
    }
);

// -------------------------
// Init
// -------------------------

loadState();

updateUserUI();

sbClient.auth.onAuthStateChange(

    (event, session)=>{

        if(
            event === "TOKEN_REFRESHED"
        ){

            return;
        }

        updateUserUI(session);
    }
);

renderDate();

renderTodos();

renderArchive();

(async ()=>{

    await loadProjectsFromCloud();

    await loadTodosFromCloud();

    renderTodos();

})();

scheduleNextDayReset();

document.addEventListener(

    "visibilitychange",

    ()=>{

        if(
            document.visibilityState ===
            "visible"
        ){

            checkDateChange();
        }
    }
);