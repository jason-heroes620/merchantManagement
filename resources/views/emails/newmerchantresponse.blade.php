<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport"
        content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Heroes: New Merchant Application</title>
    <style>
        @media screen and (max-width: 480px) {
            .w-screen {
                margin: 0px 10px 0px 10px;
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
        <img src="https://heroes.my/img/heroes-logo.png" alt="" style="padding-top: 20px; padding-bottom: 20px; width: 140px; margin-left: auto; margin-right: auto; display: block">

        <table style="table-layout: auto; width: 100%;">
            <tr>
                <td style="flex: 1; font-size: 18px; justify-content: center">Hi {{ $merchant->person_in_charge }}, </td>
            </tr>
        </table>

        <br>
        <p style="font-size: 14px; text-align: justify">Thank you for your interest to join Heroes Merchant Program. We will review your application and get back to you within 3 - 5 business days.</p>
        <br>
        <p style="font-size: 14px">
            Best Regards,
        </p>
        <p style="font-size: 14px">The Heroes Team</p>
    </div>

</body>

</html>