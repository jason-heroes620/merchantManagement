<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport"
        content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Heroes: Application Has Been Rejected</title>
    <style>
        .container {
            margin: 0 auto;
            max-width: 600px;
            padding: 6px 20px 6px 20px
        }

        .header {
            display: flex;
            justify-content: center;
            background-color: white;
            width: 100%;
            padding: 10px;
        }

        .logo {
            padding-top: 20px;
            padding-bottom: 20px;
            width: 140px;
            margin-left: auto;
            margin-right: auto;
        }

        .content {
            padding-top: 10px;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <img src="https://heroes.my/img/heroes-logo.png" alt="logo" class="logo" />
        </div>

        <div class="content">
            <table style="table-layout: auto; width: 100%;">
                <tr>
                    <td style="flex: 1; font-size: 18px; justify-content: center">Hi {{ $school->contact_person }}, </td>
                </tr>
            </table>

            <br>
            <p style="font-size: 14px; text-align: justify">Thank you for your interest in HEROES Self Planning Trip and for taking the time to submit your application. We appreciate you considering us.</p>
            <p>After careful review of all applications, we regret to inform you that your application was not selected to move forward at this time.</p>

            <p>If you have further questions, please do not hesitate to contact us at <a href="mailto:help@heroes.my">help@heroes.my</a> and we will be glad to hear from you.</p>
            <br>
            <p style="font-size: 14px">
                Best Regards,
            </p>
            <p style="font-size: 14px">The Heroes Team</p>
        </div>

    </div>

</body>

</html>