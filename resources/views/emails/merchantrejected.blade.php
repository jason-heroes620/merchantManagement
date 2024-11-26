<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport"
        content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Heroes: Merchant Application Approved</title>
    <style>
        @media screen and (max-width: 480px) {
            .w-screen {
                margin: 0px 4px 0px 4px;
            }
        }

        @media screen and (max-width: 768px) {
            .w-screen {
                margin: 0px 10px 0px 10px;
            }
        }

        @media screen and (max-width: 1024px) {
            .w-screen {
                margin: 0px 20x 0px 20px;
            }
        }

        @media screen and (max-width: 1200px) {
            .w-screen {
                margin: 0px 80px 0px 80px;
            }
        }
    </style>
</head>

<body style="flex: 1; padding-top: 100px; width: 100%; background-color: grey">
    <div style="flex: 1; justify-content: center; background-color: white; padding: 6px 10px 6px 10px" class="w-screen">
        <img src="{{asset('images/heroes-logo.png')}}" alt="" style="padding-top: 20px; padding-bottom: 20px; width: 140px; margin-left: auto; margin-right: auto; display: block">

        <table style="table-layout: auto; width: 100%;">
            <tr>
                <td style=" flex:1; font-size: 18px; justify-content: center">Hi {{ $merchant->person_in_charge }}, </td>
            </tr>
        </table>

        <br>
        <p>Thank you for your interest to join our Heroes Merchant Program. Unfortunately, your profile does not meet our requirements. If you would like to talk to our team, you can email us at <a href="mailto:help@heroes.my">help@heroes.my</a> and we will be glad to review your profile again.</p>
        <br>
        <p>
            Best Regards,
        </p>
        <p>The Heroes Team</p>
    </div>

</body>

</html>