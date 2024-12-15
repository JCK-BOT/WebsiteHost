let balance = 1000;
const spinCost = 100;
const symbols = ['7', '🍒', '🍊', '🍋', '🍇'];
let currentSymbols = ['7', '7', '7']; // 存储当前显示的符号

document.getElementById('spinButton').addEventListener('click', spin);

// 初始化老虎机滚轮
function initializeSlots() {
    const slots = document.querySelectorAll('.slot');
    slots.forEach((slot, index) => {
        const container = document.createElement('div');
        container.className = 'slot-container';
        
        // 创建足够多的符号来实现无缝滚动
        for (let i = 0; i < 30; i++) {
            const item = document.createElement('div');
            item.className = 'slot-item';
            // 确保中间位置显示当前符号
            if (i === 14) {
                item.textContent = currentSymbols[index];
            } else {
                item.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            }
            container.appendChild(item);
        }
        
        slot.innerHTML = '';
        slot.appendChild(container);
        container.style.top = '-1400px';
    });
}

function updateBalance(amount) {
    balance = amount;
    document.getElementById('balance').textContent = balance;
}

function spin() {
    if (balance < spinCost) {
        alert('余额不足！');
        return;
    }

    updateBalance(balance - spinCost);
    
    const button = document.getElementById('spinButton');
    button.disabled = true;
    
    const containers = document.querySelectorAll('.slot-container');
    const finalSymbols = [];
    
    // 确定所有列的结果
    finalSymbols[0] = symbols[Math.floor(Math.random() * symbols.length)];
    finalSymbols[1] = symbols[Math.floor(Math.random() * symbols.length)];
    finalSymbols[2] = symbols[Math.floor(Math.random() * symbols.length)];
    
    // 分别处理每一列
    function spinColumn(index) {
        const container = containers[index];
        const clone = container.cloneNode(false);
        clone.className = 'slot-container';
        
        // 生成新的随机符号序列
        for (let i = 0; i < 30; i++) {
            const item = document.createElement('div');
            item.className = 'slot-item';
            if (i === 14) {
                item.textContent = finalSymbols[index];
            } else if (i === 0) {
                item.textContent = currentSymbols[index];
            } else {
                item.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            }
            clone.appendChild(item);
        }
        
        clone.style.transition = 'none';
        clone.style.top = '0';
        container.parentNode.appendChild(clone);
        
        requestAnimationFrame(() => {
            container.remove();
            
            requestAnimationFrame(() => {
                const finalPosition = -1400;
                clone.style.transition = `top ${1.5 + index * 0.5}s cubic-bezier(.45,.05,.55,.95)`;
                clone.style.top = `${finalPosition}px`;
            });
        });
    }

    // 启动所有列
    spinColumn(0);
    spinColumn(1);
    spinColumn(2);

    // 等待动画结束后检查结果
    setTimeout(() => {
        checkWin(finalSymbols);
        button.disabled = false;
    }, 3000);

    // 更新当前符号
    currentSymbols = [...finalSymbols];
}

function checkWin(symbols) {
    const resultDiv = document.getElementById('result');
    const winAnimation = document.querySelector('.win-animation');
    const idleAnimation = document.querySelector('.idle-animation');
    
    if (symbols[0] === symbols[1] && symbols[1] === symbols[2]) {
        let winAmount = 0;
        if (symbols[0] === '7') {
            winAmount = 1000;
            // 播放大奖动画
            playBigWinAnimation();
        } else {
            winAmount = 500;
            // 播放中奖动画
            playWinAnimation();
        }
        updateBalance(balance + winAmount);
        resultDiv.textContent = `恭喜！你赢得了 ${winAmount} 币！`;
    } else if (symbols[0] === symbols[1] || symbols[1] === symbols[2] || symbols[0] === symbols[2]) {
        updateBalance(balance + 200);
        resultDiv.textContent = '小奖！赢得 200 币！';
        // 播放小奖动画
        playSmallWinAnimation();
    } else {
        resultDiv.textContent = '很遗憾，没有中奖';
    }
}

// 添加动画控制函数
function playBigWinAnimation() {
    const winAnimation = document.querySelector('.win-animation');
    const idleAnimation = document.querySelector('.idle-animation');
    
    idleAnimation.style.display = 'none';
    winAnimation.classList.remove('hidden');
    
    // 创建金币雨
    for (let i = 0; i < 30; i++) {
        const coin = document.createElement('div');
        coin.textContent = '🪙';
        coin.style.cssText = `
            position: absolute;
            left: ${Math.random() * 100}%;
            animation: coinRain ${1 + Math.random()}s linear infinite;
            animation-delay: ${Math.random() * 2}s;
        `;
        winAnimation.querySelector('.win-coins').appendChild(coin);
    }
    
    // 5秒后恢复待机动画
    setTimeout(() => {
        winAnimation.classList.add('hidden');
        idleAnimation.style.display = 'block';
        winAnimation.querySelector('.win-coins').innerHTML = '';
    }, 5000);
}

function playWinAnimation() {
    // 类似 playBigWinAnimation 但效果更温和
    const winAnimation = document.querySelector('.win-animation');
    const idleAnimation = document.querySelector('.idle-animation');
    
    idleAnimation.style.display = 'none';
    winAnimation.classList.remove('hidden');
    
    // 创建较少的金币
    for (let i = 0; i < 15; i++) {
        const coin = document.createElement('div');
        coin.textContent = '🪙';
        coin.style.cssText = `
            position: absolute;
            left: ${Math.random() * 100}%;
            animation: coinRain ${1 + Math.random()}s linear infinite;
            animation-delay: ${Math.random() * 2}s;
        `;
        winAnimation.querySelector('.win-coins').appendChild(coin);
    }
    
    setTimeout(() => {
        winAnimation.classList.add('hidden');
        idleAnimation.style.display = 'block';
        winAnimation.querySelector('.win-coins').innerHTML = '';
    }, 3000);
}

function playSmallWinAnimation() {
    // 简单的闪光效果
    const sparkles = document.querySelectorAll('.sparkle');
    sparkles.forEach(sparkle => {
        sparkle.style.animation = 'none';
        sparkle.offsetHeight; // 触发重排
        sparkle.style.animation = 'twinkle 0.5s infinite ease-in-out';
    });
    
    setTimeout(() => {
        sparkles.forEach(sparkle => {
            sparkle.style.animation = 'twinkle 2s infinite ease-in-out';
        });
    }, 2000);
}

// 页面加载时初始化老虎机
initializeSlots();

// 添加拉杆点击事件
document.querySelector('.lever-handle').addEventListener('click', function() {
    // 添加拉杆动画类
    this.classList.add('pulled');
    
    // 触发转动
    spin();
    
    // 动画结束后移除类
    setTimeout(() => {
        this.classList.remove('pulled');
    }, 500);
}); 
