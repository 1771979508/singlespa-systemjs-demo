let appContainer = null;

export async function bootstrap() {
    console.log('应用正在启动')
}

export async function mount() {
    console.log('应用正在挂载')
    appContainer = document.createElement('div')
    appContainer.id = 'appContainer'
    appContainer.innerHTML = 'hello app1'
    document.body.appendChild(appContainer)
}

export async function unmount() {
    console.log('应用正在卸载')
    document.body.removeChild(appContainer)
}