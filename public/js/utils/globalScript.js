function ready(fn) {
    if (document.readyState !== 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}
  
ready(()=>{
    let header = `
    <header>
        <i class="fa-solid fa-bars"></i>
        <div class="logoHeaderWrapper">
            <img src="img/motion_pose_icon.png" alt="MyAward_icon">
            <span>MyAward</span>
        </div>
    </header>`
    document.body.insertAdjacentHTML('afterbegin', header)
});