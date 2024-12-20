<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport"
        content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>New Merchant Application</title>
</head>

<body>
    <p style="font-size: 14px">Hello Admin, </p>
    <p style="font-size: 14px">There is a new merchant application</p>
    <p style="font-size: 14px">Here are the details:</p>
    <p style="font-size: 14px">Merchant Name: {{ $merchant->merchant_name }}</p>
    <p style="font-size: 14px">PIC: {{ $merchant->person_in_charge }}</p>
    <p style="font-size: 14px">Email: {{ $merchant->merchant_email }}</p>
    <p style="font-size: 14px">Contact No.: {{ $merchant->merchant_phone }}</p>
</body>

</html>