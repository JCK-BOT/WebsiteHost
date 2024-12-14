let balance = 1000;
const spinCost = 100;
const symbols = ['7', '🍒', '🍊', '🍋', '🍇'];

document.getElementById('spinButton').addEventListener('click', spin);

// 初始化老虎机滚轮
function initializeSlots() {
    const slots = document.querySelectorAll('.slot');
    slots.forEach(slot => {
        const container = document.createElement('div');
        container.className = 'slot-container';
        
        // 创建足够多的符号来实现无缝滚动
        for (let i = 0; i < 30; i++) {
            const item = document.createElement('div');
            item.className = 'slot-item';
            item.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            container.appendChild(item);
        }
        
        slot.innerHTML = '';
        slot.appendChild(container);
        
        // 初始位置设置为中间
        container.style.top = '-1000px';
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
    
    containers.forEach((container, index) => {
        // 选择最终符号
        const finalSymbol = symbols[Math.floor(Math.random() * symbols.length)];
        finalSymbols[index] = finalSymbol;
        
        // 克隆当前容器并生成新的随机符号序列
        const clone = container.cloneNode(false); // 只克隆容器，不克隆内容
        clone.className = 'slot-container';
        
        // 生成新的随机符号序列
        for (let i = 0; i < 30; i++) {
            const item = document.createElement('div');
            item.className = 'slot-item';
            // 确保最终位置显示选定的符号
            if (i === 15) {
                item.textContent = finalSymbol;
            } else {
                item.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            }
            clone.appendChild(item);
        }
        
        // 设置克隆容器的初始样式
        clone.style.transition = 'none';
        clone.style.top = '-1000px';
        
        // 添加到DOM
        container.parentNode.appendChild(clone);
        
        // 在下一帧开始动画
        requestAnimationFrame(() => {
            container.remove();
            
            requestAnimationFrame(() => {
                // 添加随机的额外滚动距离使结果更随机
                const extraDistance = Math.floor(Math.random() * 200);
                clone.style.transition = `top ${1.5 + index * 0.5}s cubic-bezier(.45,.05,.55,.95)`;
                clone.style.top = `${-2000 - extraDistance}px`;
            });
        });
    });

    // 等待最后一个滚轮停止后检查结果
    setTimeout(() => {
        checkWin(finalSymbols);
        button.disabled = false;
    }, 3000);
}

function checkWin(symbols) {
    const resultDiv = document.getElementById('result');
    
    if (symbols[0] === symbols[1] && symbols[1] === symbols[2]) {
        let winAmount = 0;
        if (symbols[0] === '7') {
            winAmount = 1000;
        } else {
            winAmount = 500;
        }
        updateBalance(balance + winAmount);
        resultDiv.textContent = `恭喜！你赢得了 ${winAmount} 币！`;
    } else if (symbols[0] === symbols[1] || symbols[1] === symbols[2] || symbols[0] === symbols[2]) {
        updateBalance(balance + 200);
        resultDiv.textContent = '小奖！赢得 200 币！';
    } else {
        resultDiv.textContent = '很遗憾，没有中奖';
    }
}

// 页面加载时初始化老虎机
initializeSlots(); 