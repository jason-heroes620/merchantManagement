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
    <p style="font-size: 12px">Hello Admin, </p>
    <p style="font-size: 12px">There is a new merchant application</p>
    <p style="font-size: 12px">Here are the details:</p>
    <p style="font-size: 12px">Merchant Name: {{ $merchant->merchant_name }}</p>
    <p style="font-size: 12px">PIC: {{ $merchant->person_in_charge }}</p>
    <p style="font-size: 12px">Email: {{ $merchant->merchant_email }}</p>
    <p style="font-size: 12px">Contact No.: {{ $merchant->merchant_phone }}</p>
</body>

</html>