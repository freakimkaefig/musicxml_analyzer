<nav class="navbar navbar-material-blue-grey-800 navbar-fixed-top">
    <div class="navbar-header">
        <a class="navbar-brand" href="{{ URL::route('home') }}" onclick="ga('send', 'event', { eventCategory: 'Header: Logo', eventAction: 'Click' })">Music XML Analyzer</a>
    </div>

	<div class="container-fluid">
        <div class="nav navbar-nav navbar-center">
            <h1>
            <?php
                $route = Route::currentRouteName();
                switch($route){
                    case 'pattern':
                        echo 'Search';
                        break;
                    case 'dashboard':
                        echo 'Dashboard';
                        break;
                    case 'results':
                        echo 'Search Results';
                        break;
                    case 'download':
                        echo 'Download';
                        break;
                    case 'resultDetail':
                        echo 'Result Details';
                        break;
                    default:
                        break;
                }
            ?>
            </h1>
        </div>

     	<?php if (Cookie::get('user_id')): ?>
     		<?php $user = User::find(Cookie::get('user_id')); ?>
     		<?php if ($user): ?>
     	<ul class="nav navbar-nav navbar-right">
                <?php $uploads = $user->uploads; ?>
                <?php if (!$uploads->isEmpty()): ?>
	     	<li class="btn-flat btn-material-grey-200">
                <a id="uploadButton" href="#" data-toggle="modal" data-target="#uploadModal">Uploads</a>
	     		@include('upload.dropzone')
	     	</li>
	      	<li class="btn-flat btn-material-grey-200">
                <a href="{{ URL::route('dashboard') }}" onclick="ga('send', 'event', { eventCategory: 'Header: Dashboard', eventAction: 'Click' })">Dashboard</a>
            </li>
		        <li class="btn-flat btn-material-grey-200">
                <a href="{{ URL::route('pattern') }}" onclick="ga('send', 'event', { eventCategory: 'Header: Search', eventAction: 'Click' })">Search</a>
            </li>
            <li class="divider">
                <p class="navbar-text"></p>
            </li>
            <li class="btn-flat btn-material-red-A100">
                <a id="deleteMeLink" href="/delete/me" onclick="ga('send', 'event', { eventCategory: 'Header: Reset', eventAction: 'Click' })">Reset</a>
            </li>
                <?php endif; ?>
			  	</ul>
     		<?php endif; ?>
     	<?php endif; ?>
	</div>
</nav>