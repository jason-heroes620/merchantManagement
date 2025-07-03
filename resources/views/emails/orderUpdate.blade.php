<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport"
        content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Heroes: Order Updated For Order No. {{ $order->order_no }}</title>
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
            <p>We have updated your order (Order No.: {{ $order->order_no }}) as per requested. Please <a href="https://trips.heroes.my/" targer="_blank">log in</a> to your Heroes account and review your order.</p>
            <p>If you have any questions, please do not hesitate to contact us at <a href=" mailto:help@heroes.my">help@hereos.my</a></p>
            <br>
            <p style="font-size: 14px">
                Best Regards,
            </p>
            <p style="font-size: 14px">The Heroes Team</p>
        </div>

    </div>

</body>

</html>