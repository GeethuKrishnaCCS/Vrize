import toast from 'react-simple-toasts';
import 'react-simple-toasts/dist/style.css';
import 'react-simple-toasts/dist/theme/dark.css';
import './Toast-Style.css';

function Toast(type: any, message: any) {
    switch (type) {
        case "error":
            return toast(message, {
                className: 'error-toast',
                duration: 4000,
                position: 'bottom-center'
            })
            break;
        case "warning":
            return toast(message, {
                className: 'warning-toast',
                duration: 4000,
                position: 'bottom-center'
            })
            break;
        case "info":
            return toast(message, {
                className: 'info-toast',
                duration: 4000,
                position: 'bottom-center'
            })
            break;
        case "success":
            return toast(message, {
                className: 'success-toast',
                duration: 4000,
                position: 'bottom-center'
            })
            break;

        default:
            break;
    }
    return
}

export default Toast;
