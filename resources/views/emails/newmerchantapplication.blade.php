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
    <p>Hello Admin, </p>
    <p>There is a new merchant application</p>
    <p>Here are the details:</p>
    <p>Merchant Name: {{ $merchant->merchant_name }}</p>
    <p>PIC: {{ $merchant->person_in_charge }}</p>
    <p>Email: {{ $merchant->merchant_email }}</p>
    <p>Contact No.: {{ $merchant->merchant_phone }}</p>
</body>

</html>