<template>
	<div class="main-content ofh">
		<g-header></g-header>
		<div class="wrapper">
			<div class="pageContent">
				<el-row>
					<el-col :span="24">
						<slot></slot>
					</el-col>
				</el-row>
			</div>
		</div>
	</div>
</template>

<script>
	import GHeader from './Header'

	export default {
		name: 'Wrapper',
		components: {
			GHeader
		}
	}
</script>