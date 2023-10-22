<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>dZENcode Test</title>
    <script type="module" crossorigin src="{{ asset('dist/assets/index-44e71e2c.js') }}"></script>
    <link rel="stylesheet" href="{{ asset('dist/assets/index-d5b290e5.css') }}">
    <link href="{{ asset('dist/assets/lightbox/css/lightbox.css') }}" rel="stylesheet">

    <!-- Bootstrap CSS from CDN -->
    <link href="{{asset('dist/assets/bootstrap/dist/css/bootstrap.css')}}" rel="stylesheet">

</head>
<body>

<div id="root"></div>


<script src="{{ asset('dist/assets/bootstrap/dist/js/bootstrap.js') }}"></script>
<script src="{{ asset('dist/assets/bootstrap/dist/js/bootstrap.bundle.js') }}"></script>
<script src="{{ asset('dist/assets/lightbox/js/lightbox-plus-jquery.js') }}"></script>
<script src="{{ asset('dist/assets/index-44e71e2c.js') }}"></script>
</body>
</html>
