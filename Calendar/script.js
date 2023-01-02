let nav = 0; //追蹤我們正在查看的月份
let clicked = null;
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];

const calendar = document.getElementById('calendar');
const newEventModal = document.getElementById('newEventModal');
const deleteEventModal = document.getElementById('deleteEventModal');
const backDrop =document.getElementById('modalBackDrop');
const eventTitleInput =document.getElementById('eventTitleInput');
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', "Saturday"];

function openModal(date){
    clicked = date;
    
    const eventForday = events.find(e => e.date === clicked); 
    if(eventForday){
        // console.log('Event is exists');
        document.getElementById('eventText').innerText = eventForday.title;
        deleteEventModal.style.display ='block';
    }else{
        newEventModal.style.display = 'block';
    }
    backDrop.style.display = 'block';
}

function load() {
    const dt = new Date(); //回傳目前時間的日期物件

    //以當前月份為基準nav=0 上一個月nav=-1 下一個月nav=1
    if(nav !== 0 ){
        dt.setMonth(new Date().getMonth() + nav);
    }

    // console.log(dt)

    const day = dt.getDate(); //回傳數值，取得該日為該月份的幾號
    const month = dt.getMonth();
    const year =dt.getFullYear();

    // console.log(day,month,year);//25 0 2023 month(index)

    const firstDayOfMonth = new Date(year, month, 1)//得到第一天
    const daysInMonth = new Date(year, month + 1, 0).getDate();//會取得上個月的最後一天的日期(要幾格日期)
    
    const dateString = firstDayOfMonth.toLocaleDateString('en-us',{
        weekday:'long',
        year:'numeric',
        month:'numeric',
        day:'numeric',
    });
    //dateString: Sunday, 1/1/2023

    
    const paddingDays = weekdays.indexOf(dateString.split(', ')[0]); //比對 dateString的[0] Sunday是在weekdays裡的索引
    
    //顯示月份
    document.getElementById('monthdisplay').innerText = 
    `${dt.toLocaleDateString('en-us',{month:'long'})} ${year}`;

    calendar.innerHTML = '';//換月份時先清除月份方塊和日期

    //做日期的方塊
    for (let i = 1; i <= paddingDays + daysInMonth ; i++) {

        const daySquare = document.createElement('div');
        daySquare.classList.add('day');

        const dayString = `${month + 1 }/${ i - paddingDays}/${year}`;

        if(i > paddingDays){
            daySquare.innerText = i - paddingDays;

            const eventForday = events.find(e => e.date === dayString);

            if( i - paddingDays === day && nav === 0){
                daySquare.id = 'currentDay'
            }

            //行程加進日曆
            if(eventForday){
                const eventDiv = document.createElement('div');
                eventDiv.classList.add('event');
                eventDiv.innerText = eventForday.title;
                daySquare.appendChild(eventDiv);
            }
            
        }else{
            daySquare.classList.add('padding');
        }
        daySquare.addEventListener('click',() => openModal(dayString));
        calendar.appendChild(daySquare);
    }
    // console.log(paddingDays)
}

//方法 刪除行程
function closeModal(){
    eventTitleInput.classList.remove('error');
    newEventModal.style.display ='none';
    deleteEventModal.style.display ='none';
    backDrop.style.display ='none';
    eventTitleInput.value ='';
    clicked = null;
    load();
}

//方法 新增行程
function saveEvent(){
    if(eventTitleInput.value){
        eventTitleInput.classList.remove('error');
        
        events.push({
            date: clicked,
            title: eventTitleInput.value,
        });
        localStorage.setItem('events',JSON.stringify(events));
        closeModal();
    }else{
        eventTitleInput.classList.add('error');
    }
}
//方法 刪除行程
function deleteEvent(){
    events = events.filter( e => e.date !== clicked);
    localStorage.setItem('events',JSON.stringify(events));
    closeModal();
}
//事件 按鈕 
function initButtons(){
    document.getElementById('nextBtn').addEventListener('click',() => {
        nav++;
        load();
    })
    document.getElementById('backBtn').addEventListener('click',() => {
        nav--;
        load();
    })

    document.getElementById('saveBtn').addEventListener('click',saveEvent)
    document.getElementById('cancelBtn').addEventListener('click',closeModal)

    document.getElementById('deleteBtn').addEventListener('click',deleteEvent)
    document.getElementById('closeBtn').addEventListener('click',closeModal)
}

initButtons();
load();