import Snackbar from 'awesome-snackbar';

const snackBar = ({
    error,
    success,
    customPurple,
    customGray,
    message,
    position = 'bottom-right',
    containerColor = '',
    messageColor = '',
    timeout = '4000',
    waitForEvent
}) => {

    if (success) {
        return new Snackbar(message, {
            timeout: timeout || '1000',
            position: position || 'bottom-left',
            waitForEvent: waitForEvent || false,
            style: {
                container: [
                    ['background-color', 'rgb(214, 241, 223)' ],
                    ['border-radius', '5px'],
                ],
                message: [
                    ['color', 'rgb(33, 131, 88)'],
                    ['font-weight', 'bold'],
                ]
            }
        })
    }

    if(error) {
        return new Snackbar(message, {
            timeout: timeout || '1000' ,
            position: 'top-right',
            waitForEvent: waitForEvent || false,
            style: {
                container: [
                    ['background-color', 'rgb(255, 219, 220)' ],
                    ['border-radius', '5px'],
                ],
                message: [
                    ['color', "rgb(206, 44, 49)"],
                    ['font-weight', 'bold'],
                ]
            }
        })
    }

    if(customPurple) {
        return new Snackbar(message, {
            timeout: timeout || '1000',
            position: 'bottom-center',
            waitForEvent: waitForEvent || false,
            style: {
                container: [
                    ['background-color', 'rgb(110, 86, 207)' ],
                    ['border-radius', '5px'],
                ],
                message: [
                    ['color', "rgb(240, 240, 240)"],
                    ['font-weight', 'bold'],
                ]
            }
        })
    }
    if(customGray) {
        return new Snackbar(message, {
            timeout: timeout || '1000',
            position:  'bottom-center',
            waitForEvent: waitForEvent || false,
            style: {
                container: [
                    ['background-color', 'rgb(187, 187, 187)' ],
                    ['border-radius', '5px'],
                ],
                message: [
                    ['color', "rgb(47, 38, 95)"],
                    ['font-weight', 'bold'],
                ]
            }
        })
    }

    return new Snackbar(message, {
        timeout,
        position,
        waitForEvent,
        style: {
            container: [
                ['background-color', containerColor],
                ['border-radius', '5px'],
            ],
            message: [
                ['color', messageColor],
                ['font-weight', 'bold'],
            ]
        }
    })
}

export default snackBar;