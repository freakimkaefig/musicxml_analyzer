<nav class="navbar navbar-inverse navbar-fixed-top">

	<div class="container-fluid">
     	<ul class="nav navbar-nav">
     		<li><a class="navbar-brand" href="{{ URL::route('home') }}">LOGO</a></li>
     	</ul>

     	<?php if (Cookie::get('user_id')): ?>
     		<?php $user = User::find(Cookie::get('user_id')); ?>
     		<?php if ($user): ?>
     			<?php $uploads = $user->uploads; ?>
     			<?php if (!$uploads->isEmpty()): ?>
			     	<ul class="nav navbar-nav navbar-right">
			     		<li>
                                   <button type="button" class="btn btn-primary navbar-btn" data-toggle="modal" data-target="#uploadModal">Uploads
                                   </button>
			     			@include('upload.dropzone')
			     		</li>
			      		<li><a href="{{ URL::route('dashboard') }}">Dashboard</a></li>
			      		<li><a href="#">Search</a></li>
			  		</ul>
     			<?php endif; ?>
     		<?php endif; ?>
     	<?php endif; ?>


	</div>
</nav>